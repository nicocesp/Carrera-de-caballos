package carrera.ui;

import carrera.model.GameState;
import carrera.model.Player;
import carrera.model.Suit;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.Button;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;

import java.util.Map;

/**
 * Vista de resultados: ganador, turnos, cartas reveladas, retrocesos por palo, estadísticas de apuestas.
 */
public class ResultsView {

    private final GameState state;
    private final Runnable onBack;
    private final VBox view;

    public ResultsView(GameState state, Runnable onBack) {
        this.state = state;
        this.onBack = onBack;
        this.view = buildView();
    }

    private VBox buildView() {
        VBox main = new VBox(24);
        main.setAlignment(Pos.CENTER);
        main.setPadding(new Insets(40));
        main.getStyleClass().add("panel");

        Suit winner = state.getWinner();
        Text winnerText = new Text(winner != null ? "🏇 Ganador: " + winner.getSymbol() + " " + winner.getDisplayName() : "Sin ganador (mazo agotado)");
        winnerText.getStyleClass().add("winner-banner");

        GridPane stats = new GridPane();
        stats.setHgap(20);
        stats.setVgap(10);
        stats.setAlignment(Pos.CENTER);
        int row = 0;
        stats.add(new Text("Turnos:"), 0, row);
        stats.add(new Text(String.valueOf(state.getTurnCount())), 1, row);
        row++;
        stats.add(new Text("Cartas reveladas:"), 0, row);
        stats.add(new Text(String.valueOf(state.getTotalCardsRevealed())), 1, row);
        row++;
        for (Map.Entry<Suit, Integer> e : state.getRetreatsBySuit().entrySet()) {
            stats.add(new Text("Retrocesos " + e.getKey().getSymbol() + " " + e.getKey().getDisplayName() + ":"), 0, row);
            stats.add(new Text(String.valueOf(e.getValue())), 1, row);
            row++;
        }

        main.getChildren().addAll(winnerText, stats);

        if (state.getConfig().isBetsEnabled() && !state.getPlayers().isEmpty()) {
            Text betsTitle = new Text("Apuestas (fichas)");
            betsTitle.getStyleClass().add("subtitle");
            main.getChildren().add(betsTitle);
            for (Player p : state.getPlayers()) {
                int change = (state.getWinner() == p.getBetSuit()) ? 10 : -5;
                p.addChips(change);
                Text t = new Text(p.getName() + " apostó a " + p.getBetSuit().getSymbol() + " " + p.getBetSuit().getDisplayName() + " → " + (change >= 0 ? "+" : "") + change + " → " + p.getChips() + " fichas");
                t.getStyleClass().add("label");
                main.getChildren().add(t);
            }
        }

        Button back = new Button("Volver al menú");
        back.getStyleClass().add("button");
        back.setOnAction(e -> onBack.run());
        main.getChildren().add(back);
        return main;
    }

    public VBox getView() {
        return view;
    }
}
