package carrera.ui;

import carrera.game.GameEngine;
import carrera.model.GameState;
import carrera.model.Player;
import carrera.model.Suit;
import carrera.util.GameConfig;
import javafx.scene.layout.Pane;
import javafx.scene.layout.StackPane;
import javafx.stage.Stage;

import java.util.function.Supplier;

/**
 * Controlador principal: cambia entre menú, configuración, reglas, partida y resultados.
 */
public class AppController {

    private final Supplier<StackPane> rootGetter;
    private final Supplier<Stage> stageGetter;
    private GameConfig config;
    private GameState state;
    private GameEngine engine;
    private MenuView menuView;
    private ConfigView configView;
    private RulesView rulesView;
    private RaceView raceView;
    private ResultsView resultsView;

    public AppController(Supplier<StackPane> rootGetter, Supplier<Stage> stageGetter) {
        this.rootGetter = rootGetter;
        this.stageGetter = stageGetter;
        this.config = new GameConfig();
        this.menuView = new MenuView(this::onNewGame, this::onConfig, this::onRules, this::onExit);
        this.configView = new ConfigView(config, this::onConfigBack);
        this.rulesView = new RulesView(this::onRulesBack);
    }

    public Pane getMenuView() {
        return menuView.getView();
    }

    public void showMenu() {
        rootGetter.get().getChildren().setAll(getMenuView());
    }

    private void onNewGame() {
        state = new GameState(config);
        for (int i = 0; i < config.getNumPlayers(); i++) {
            Suit bet = config.isBetsEnabled() ? Suit.values()[i % 4] : null;
            state.addPlayer(new Player(i + 1, "Jugador " + (i + 1), bet, 100));
        }
        engine = new GameEngine(state, null);
        engine.initNewRace();
        raceView = new RaceView(state, engine, config, this::onRaceFinished, this::onRaceBack);
        rootGetter.get().getChildren().setAll(raceView.getView());
    }

    private void onRaceFinished() {
        resultsView = new ResultsView(state, this::onResultsBack);
        rootGetter.get().getChildren().setAll(resultsView.getView());
    }

    private void onRaceBack() {
        showMenu();
    }

    private void onResultsBack() {
        showMenu();
    }

    private void onConfig() {
        configView.refreshFromConfig();
        rootGetter.get().getChildren().setAll(configView.getView());
    }

    private void onConfigBack() {
        configView.applyToConfig();
        showMenu();
    }

    private void onRules() {
        rootGetter.get().getChildren().setAll(rulesView.getView());
    }

    private void onRulesBack() {
        showMenu();
    }

    private void onExit() {
        stageGetter.get().close();
    }
}
