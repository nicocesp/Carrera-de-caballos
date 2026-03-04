package carrera.ui;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.layout.StackPane;
import javafx.scene.text.Font;
import javafx.stage.Stage;

import java.io.File;

/**
 * Aplicación JavaFX: menú principal, configuración, reglas, partida y resultados.
 */
public class GameApplication extends Application {

    private Stage primaryStage;
    private StackPane root;
    private AppController controller;

    @Override
    public void start(Stage stage) {
        loadEmojiFont();
        this.primaryStage = stage;
        this.root = new StackPane();
        this.controller = new AppController(this::getRoot, this::getPrimaryStage);

        root.getStyleClass().add("root");
        root.getChildren().setAll(controller.getMenuView());

        Scene scene = new Scene(root, 900, 700);
        var css = getClass().getResource("/styles.css");
        if (css != null) scene.getStylesheets().add(css.toExternalForm());
        primaryStage.setTitle("Carreras de Caballos - Baraja Española");
        primaryStage.setScene(scene);
        primaryStage.setMinWidth(700);
        primaryStage.setMinHeight(550);
        primaryStage.show();
    }

    /**
     * Carga la fuente de emojis de Windows para que se muestren correctamente.
     */
    private void loadEmojiFont() {
        String windir = System.getenv("WINDIR");
        if (windir != null && !windir.isEmpty()) {
            String[] emojiFonts = { "seguiemj.ttf", "SegoeUIEmoji.ttf" };
            for (String name : emojiFonts) {
                File fontFile = new File(windir + File.separator + "Fonts" + File.separator + name);
                if (fontFile.canRead()) {
                    try {
                        Font.loadFont(fontFile.toURI().toString(), 14);
                        break;
                    } catch (Exception ignored) { }
                }
            }
        }
    }

    private StackPane getRoot() {
        return root;
    }

    private Stage getPrimaryStage() {
        return primaryStage;
    }
}
