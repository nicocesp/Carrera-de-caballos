package carrera.ui;

import carrera.util.GameConfig;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.Button;
import javafx.scene.control.CheckBox;
import javafx.scene.control.ComboBox;
import javafx.scene.control.Label;
import javafx.scene.control.Slider;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;

/**
 * Vista de configuración: tamaño pista, jugadores, baraja 40/48, apuestas, modo auto/paso a paso.
 */
public class ConfigView {

    private final GameConfig config;
    private final Runnable onBack;

    private Slider trackSlider;
    private Slider playersSlider;
    private ComboBox<String> deckCombo;
    private CheckBox betsCheck;
    private CheckBox autoModeCheck;

    private final VBox view;

    public ConfigView(GameConfig config, Runnable onBack) {
        this.config = config;
        this.onBack = onBack;
        this.view = buildView();
    }

    private VBox buildView() {
        VBox main = new VBox(20);
        main.setAlignment(Pos.CENTER);
        main.setPadding(new Insets(30));
        main.getStyleClass().add("panel");

        Text title = new Text("Configuración");
        title.getStyleClass().add("title");

        GridPane grid = new GridPane();
        grid.setHgap(20);
        grid.setVgap(16);
        grid.setAlignment(Pos.CENTER);

        trackSlider = new Slider(3, 15, config.getTrackLength());
        trackSlider.setShowTickLabels(true);
        trackSlider.setShowTickMarks(true);
        trackSlider.setMajorTickUnit(2);
        trackSlider.setBlockIncrement(1);
        Label trackLabel = new Label("Tamaño de pista (N): " + (int) trackSlider.getValue());
        trackSlider.valueProperty().addListener((o, a, b) -> trackLabel.setText("Tamaño de pista (N): " + (int) b.doubleValue()));
        grid.add(new Label("Pista:"), 0, 0);
        grid.add(trackSlider, 1, 0);
        grid.add(trackLabel, 2, 0);

        playersSlider = new Slider(GameConfig.MIN_PLAYERS, GameConfig.MAX_PLAYERS, config.getNumPlayers());
        playersSlider.setShowTickLabels(true);
        playersSlider.setBlockIncrement(1);
        Label playersLabel = new Label("Jugadores: " + (int) playersSlider.getValue());
        playersSlider.valueProperty().addListener((o, a, b) -> playersLabel.setText("Jugadores: " + (int) b.doubleValue()));
        grid.add(new Label("Jugadores:"), 0, 1);
        grid.add(playersSlider, 1, 1);
        grid.add(playersLabel, 2, 1);

        deckCombo = new ComboBox<>();
        deckCombo.getItems().addAll("40 cartas", "48 cartas");
        deckCombo.getSelectionModel().select(config.getDeckSize() == GameConfig.DECK_48 ? 1 : 0);
        grid.add(new Label("Baraja:"), 0, 2);
        grid.add(deckCombo, 1, 2);

        betsCheck = new CheckBox("Activar apuestas (fichas/puntos)");
        betsCheck.setSelected(config.isBetsEnabled());
        grid.add(betsCheck, 0, 3);
        grid.add(new HBox(), 1, 3);

        autoModeCheck = new CheckBox("Modo automático (avanzar sin pulsar)");
        autoModeCheck.setSelected(config.isAutoMode());
        grid.add(autoModeCheck, 0, 4);
        grid.add(new HBox(), 1, 4);

        Button back = new Button("Volver al menú");
        back.getStyleClass().add("button");
        back.setOnAction(e -> onBack.run());

        main.getChildren().addAll(title, grid, back);
        return main;
    }

    public void refreshFromConfig() {
        trackSlider.setValue(config.getTrackLength());
        playersSlider.setValue(config.getNumPlayers());
        deckCombo.getSelectionModel().select(config.getDeckSize() == GameConfig.DECK_48 ? 1 : 0);
        betsCheck.setSelected(config.isBetsEnabled());
        autoModeCheck.setSelected(config.isAutoMode());
    }

    public void applyToConfig() {
        config.setTrackLength((int) trackSlider.getValue());
        config.setNumPlayers((int) playersSlider.getValue());
        config.setDeckSize(deckCombo.getSelectionModel().getSelectedIndex() == 1 ? GameConfig.DECK_48 : GameConfig.DECK_40);
        config.setBetsEnabled(betsCheck.isSelected());
        config.setAutoMode(autoModeCheck.isSelected());
    }

    public VBox getView() {
        return view;
    }
}
