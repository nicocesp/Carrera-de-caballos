package carrera.ui;

import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.Button;
import javafx.scene.control.ScrollPane;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;

/**
 * Vista de reglas del juego con tipografía grande y llamativa.
 */
public class RulesView {

    private final VBox view;

    public RulesView(Runnable onBack) {
        this.view = buildView(onBack);
    }

    private VBox buildView(Runnable onBack) {
        VBox main = new VBox(20);
        main.setAlignment(Pos.CENTER);
        main.setPadding(new Insets(24));
        main.getStyleClass().add("panel");

        Text title = new Text("Reglas del juego");
        title.getStyleClass().add("rules-title");

        VBox content = new VBox(12);
        content.setPadding(new Insets(8, 0, 8, 0));
        content.setMaxWidth(720);

        addRuleTitle(content, "CARRERAS DE CABALLOS - BARAJA ESPAÑOLA");
        addRuleBody(content, "Hay 4 caballos 🏇, uno por palo: 🪙 Oros, 🏆 Copas, ⚔️ Espadas, 🪵 Bastos (representados por los 4 Ases).");
        addRuleBody(content, "");

        addRuleTitle(content, "LA PISTA");
        addRuleBody(content, "La pista tiene N casillas (checkpoints). Por defecto N = 7. Las N primeras cartas del mazo (tras barajar) forman la pista boca abajo.");
        addRuleBody(content, "El resto del mazo (excluyendo los 4 Ases y las N cartas de pista) es el \"mazo de carrera\".");
        addRuleBody(content, "");

        addRuleTitle(content, "CADA TURNO");
        addRuleBody(content, "Se revela 1 carta del mazo de carrera:");
        addRuleHighlight(content, "→ El caballo del palo de esa carta avanza 1 casilla.");
        addRuleBody(content, "");

        addRuleTitle(content, "OBSTÁCULO");
        addRuleBody(content, "Cuando TODOS los caballos han alcanzado o sobrepasado la siguiente casilla de checkpoint, se voltea esa carta de pista:");
        addRuleHighlight(content, "→ El caballo del palo de la carta revelada retrocede 1 casilla (si está en 0, no baja).");
        addRuleBody(content, "");

        addRuleTitle(content, "VICTORIA");
        addRuleHighlight(content, "Gana el primer caballo que sobrepase el último checkpoint (posición > N).");
        addRuleBody(content, "");

        addRuleTitle(content, "REBARAJAR");
        addRuleBody(content, "Si el mazo de carrera se agota antes de que haya ganador, se rebaraja el descarte (no las cartas de pista) y se continúa.");
        addRuleBody(content, "");

        addRuleTitle(content, "APUESTAS (OPCIONAL)");
        addRuleBody(content, "Antes de iniciar, cada jugador elige un palo. Al final se muestran ganador y estadísticas en fichas/puntos.");
        addRuleBody(content, "");

        addRuleTitle(content, "BARAJA ESPAÑOLA");
        addRuleBody(content, "40 cartas: rangos 1-7, 10-12 (sin 8 y 9). Opcional 48 cartas: rangos 1-12.");
        addRuleBody(content, "El movimiento depende solo del PALO de la carta revelada.");

        ScrollPane scroll = new ScrollPane(content);
        scroll.setFitToWidth(true);
        scroll.setStyle("-fx-background-color: transparent;");
        scroll.setPadding(new Insets(0));

        Button back = new Button("Volver al menú");
        back.getStyleClass().add("button");
        back.setOnAction(e -> onBack.run());

        main.getChildren().addAll(title, scroll, back);
        return main;
    }

    private void addRuleTitle(VBox content, String text) {
        Text t = new Text(text);
        t.getStyleClass().add("rules-heading");
        t.setWrappingWidth(680);
        content.getChildren().add(t);
    }

    private void addRuleBody(VBox content, String text) {
        if (text.isEmpty()) {
            content.getChildren().add(new Text(" "));
            return;
        }
        Text t = new Text(text);
        t.getStyleClass().add("rules-body");
        t.setWrappingWidth(680);
        content.getChildren().add(t);
    }

    private void addRuleHighlight(VBox content, String text) {
        Text t = new Text(text);
        t.getStyleClass().add("rules-highlight");
        t.setWrappingWidth(680);
        content.getChildren().add(t);
    }

    public VBox getView() {
        return view;
    }
}
