package carrera.ui;

import carrera.game.GameEngine;
import carrera.model.Card;
import carrera.model.GameState;
import carrera.model.Horse;
import carrera.model.Suit;
import carrera.model.Track;
import carrera.util.GameConfig;
import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.application.Platform;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.ScrollPane;
import javafx.scene.control.TextArea;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;
import javafx.util.Duration;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

/**
 * Vista de la carrera: pista, posiciones, carta revelada, log, siguiente turno / auto, exportar log.
 */
public class RaceView {

    private final GameState state;
    private final GameEngine engine;
    private final GameConfig config;
    private final Runnable onFinished;
    private final Runnable onBack;

    private final VBox view;
    private Text cardRevealedLabel;
    private Text checkpointLabel;
    private TextArea logArea;
    private GridPane trackGrid;
    private Timeline autoTimeline;

    public RaceView(GameState state, GameEngine engine, GameConfig config, Runnable onFinished, Runnable onBack) {
        this.state = state;
        this.engine = engine;
        this.config = config;
        this.onFinished = onFinished;
        this.onBack = onBack;
        this.view = buildView();
        refreshAll();
    }

    private VBox buildView() {
        VBox main = new VBox(16);
        main.setPadding(new Insets(20));
        main.setAlignment(Pos.TOP_CENTER);

        HBox top = new HBox(20);
        top.setAlignment(Pos.CENTER_LEFT);

        Button backBtn = new Button("← Menú");
        backBtn.getStyleClass().add("button");
        backBtn.setOnAction(e -> {
            if (autoTimeline != null) autoTimeline.stop();
            onBack.run();
        });
        top.getChildren().add(backBtn);

        cardRevealedLabel = new Text("—");
        cardRevealedLabel.getStyleClass().add("label");
        cardRevealedLabel.getStyleClass().add("card-revealed");
        checkpointLabel = new Text("");
        checkpointLabel.getStyleClass().add("label");
        checkpointLabel.getStyleClass().add("bright");
        top.getChildren().addAll(cardRevealedLabel, checkpointLabel);

        trackGrid = new GridPane();
        trackGrid.setHgap(4);
        trackGrid.setVgap(4);
        trackGrid.getStyleClass().add("track-container");
        trackGrid.setPadding(new Insets(12));

        logArea = new TextArea();
        logArea.setEditable(false);
        logArea.setPrefRowCount(8);
        logArea.setWrapText(true);
        logArea.getStyleClass().add("log-area");

        ScrollPane logScroll = new ScrollPane(logArea);
        logScroll.setFitToWidth(true);

        Button nextBtn = new Button("Siguiente turno");
        nextBtn.getStyleClass().add("button");
        nextBtn.getStyleClass().add("primary");
        nextBtn.setOnAction(e -> doOneTurn());

        Button exportBtn = new Button("Exportar log a .txt");
        exportBtn.getStyleClass().add("button");
        exportBtn.setOnAction(e -> exportLog());

        HBox buttons = new HBox(12);
        buttons.setAlignment(Pos.CENTER);
        buttons.getChildren().addAll(nextBtn, exportBtn);

        main.getChildren().addAll(top, trackGrid, logScroll, buttons);

        if (config.isAutoMode()) {
            autoTimeline = new Timeline(new KeyFrame(Duration.millis(600), ev -> doOneTurn()));
            autoTimeline.setCycleCount(Timeline.INDEFINITE);
            autoTimeline.play();
        }

        return main;
    }

    private void doOneTurn() {
        if (state.getWinner() != null) {
            if (autoTimeline != null) autoTimeline.stop();
            onFinished.run();
            return;
        }
        if (!engine.canContinue()) {
            state.log("No hay más cartas. Partida terminada sin ganador.");
            if (autoTimeline != null) autoTimeline.stop();
            onFinished.run();
            return;
        }
        GameEngine.TurnResult result = engine.runOneTurn();
        cardRevealedLabel.setText(result.getDrawnCard() != null ? result.getDrawnCard().toShortString() : "—");
        if (result.isCheckpointFlipped() && result.getFlippedCard() != null) {
            checkpointLabel.setText("Checkpoint: " + result.getFlippedCard().toShortString() + " → " + result.getFlippedCard().getSuit() + " retrocede");
        } else {
            checkpointLabel.setText("");
        }
        refreshTrack();
        refreshLog();
        if (engine.hasWinner() || !engine.canContinue()) {
            if (autoTimeline != null) autoTimeline.stop();
            Platform.runLater(() -> onFinished.run());
        }
    }

    private void refreshAll() {
        refreshTrack();
        refreshLog();
        cardRevealedLabel.setText("—");
        checkpointLabel.setText("");
    }

    private void refreshTrack() {
        trackGrid.getChildren().clear();
        Track track = state.getTrack();
        int n = track.getLength();
        Map<Suit, Horse> horses = state.getHorses();

        // Cabecera: casilla 0 (salida), 1..N (checkpoints), N+1 (meta)
        for (int col = 0; col <= n + 1; col++) {
            String header = col == 0 ? "Salida" : (col <= n ? "CP" + col : "Meta");
            Label h = new Label(header);
            h.getStyleClass().add("label");
            trackGrid.add(h, col, 0);
        }
        int row = 1;
        for (Suit s : Suit.values()) {
            Horse h = horses.get(s);
            if (h == null) continue;
            for (int col = 0; col <= n + 1; col++) {
                Label cell = new Label("");
                cell.getStyleClass().add("track-cell");
                if (col == 0) cell.getStyleClass().add("start");
                else if (col > n) cell.getStyleClass().add("finish");
                else cell.getStyleClass().add("checkpoint");
                if (h.getPosition() == col) {
                    cell.setText("🏇");
                    cell.getStyleClass().add("horse-" + s.name().toLowerCase());
                }
                trackGrid.add(cell, col, row);
            }
            row++;
        }
    }

    private void refreshLog() {
        StringBuilder sb = new StringBuilder();
        for (String line : state.getLog()) sb.append(line).append("\n");
        logArea.setText(sb.toString());
        logArea.setScrollTop(Double.MAX_VALUE);
    }

    private void exportLog() {
        try {
            Path path = Path.of("carrera_log.txt");
            Files.writeString(path, String.join("\n", state.getLog()));
            state.log("Log exportado a " + path.toAbsolutePath());
            refreshLog();
        } catch (IOException e) {
            state.log("Error al exportar: " + e.getMessage());
            refreshLog();
        }
    }

    public VBox getView() {
        return view;
    }
}
