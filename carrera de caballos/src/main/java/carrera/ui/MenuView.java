package carrera.ui;

import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.Button;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;

/**
 * Vista del menú principal: Nueva partida, Configuración, Ver reglas, Salir.
 */
public class MenuView {

    private final VBox view;
    private final Runnable onNewGame;
    private final Runnable onConfig;
    private final Runnable onRules;
    private final Runnable onExit;

    public MenuView(Runnable onNewGame, Runnable onConfig, Runnable onRules, Runnable onExit) {
        this.onNewGame = onNewGame;
        this.onConfig = onConfig;
        this.onRules = onRules;
        this.onExit = onExit;
        this.view = buildView();
    }

    private VBox buildView() {
        VBox box = new VBox(24);
        box.setAlignment(Pos.CENTER);
        box.setPadding(new Insets(40));
        box.getStyleClass().add("menu-box");

        Text title = new Text("Carreras de Caballos");
        title.getStyleClass().add("title");

        Text subtitle = new Text("Baraja Española · 🪙 Oros  🏆 Copas  ⚔️ Espadas  🪵 Bastos");
        subtitle.getStyleClass().add("subtitle");

        Button btnNew = new Button("Nueva partida");
        btnNew.getStyleClass().add("button");
        btnNew.getStyleClass().add("primary");
        btnNew.setOnAction(e -> onNewGame.run());

        Button btnConfig = new Button("Configuración");
        btnConfig.getStyleClass().add("button");
        btnConfig.setOnAction(e -> onConfig.run());

        Button btnRules = new Button("Ver reglas");
        btnRules.getStyleClass().add("button");
        btnRules.setOnAction(e -> onRules.run());

        Button btnExit = new Button("Salir");
        btnExit.getStyleClass().add("button");
        btnExit.getStyleClass().add("danger");
        btnExit.setOnAction(e -> onExit.run());

        box.getChildren().addAll(title, subtitle, btnNew, btnConfig, btnRules, btnExit);
        return box;
    }

    public VBox getView() {
        return view;
    }
}
