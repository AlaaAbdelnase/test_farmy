import * as Phaser from "https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.esm.js";
import { GameScene } from "./floodintro.js";
import introScene from "./intro.js";
import exploreScene from "./explore.js";
import FloodScene from "./floodGame.js";
import Level1Scene from "./level1flood.js";
import Level2Scene from "./level2flood.js";
import HeatmapScene from "./heatmapScene.js";
import heatGameScene from "./heatGame.js";
import WaterScene from "./waterScene.js";
import waterGame from "./waterGame.js";
import { DroughtScene, PlayScene, ResultScene } from "./drought.js";
import { SalinizedFarmScene } from "./SalinizedFarmScene.js";
import NDVIMapScene from "./NDVIMap.js";
import { Game } from "./Start.js";
import { LoadingManager, AssetOptimizer } from "./LoadingManager.js";

const gameCanvas = document.getElementById("gameCanvas");

// Better sizing for deployment
const sizes = {
  width: Math.min(window.innerWidth, 1920), // Cap at 1920px
  height: Math.min(window.innerHeight, 1080), // Cap at 1080px
};

// Ensure minimum size
if (sizes.width < 800) sizes.width = 800;
if (sizes.height < 600) sizes.height = 600;

console.log("Canvas size:", sizes);

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  backgroundColor: "#0f0f23",
  input: {
    keyboard: true,
    mouse: true,
    touch: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  // Asset loading optimizations
  loader: {
    crossOrigin: "anonymous",
    maxParallelDownloads: 4, // Reduced for better stability
    timeout: 60000, // Increased timeout for slow connections
    baseURL: "./", // Ensure relative paths work
  },
  scene: [
    introScene,
    exploreScene,
    GameScene,
    FloodScene,
    Level1Scene,
    Level2Scene,
    HeatmapScene,
    heatGameScene,
    WaterScene,
    waterGame,
    DroughtScene,
    PlayScene,
    ResultScene,
    SalinizedFarmScene,
    NDVIMapScene,
    Game,
  ],
  pixelArt: true,
};

// Add error handling and debugging
try {
  const game = new Phaser.Game(config);

  // Add error event listeners
  game.events.on("error", (error) => {
    console.error("Phaser Game Error:", error);
    document.getElementById("loading").innerHTML = `
      <h2>🌱 NASA Farming Game</h2>
      <p style="color: #ff4444;">Error loading game: ${error.message}</p>
      <p>Please refresh the page to try again.</p>
    `;
  });

  // Add scene error handling with null check
  const introScene = game.scene.getScene("scene-intro");
  if (introScene) {
    introScene.events.on("error", (error) => {
      console.error("Scene Error:", error);
    });

    // Add scene creation event listener
    introScene.events.on("create", () => {
      console.log("Intro scene created successfully");
    });

    // Add scene preload event listener
    introScene.events.on("preload", () => {
      console.log("Intro scene preload started");
    });
  } else {
    console.warn(
      "Intro scene not found, will add listeners after scene starts"
    );
  }

  // Start the intro scene with delay to ensure scenes are ready
  setTimeout(() => {
    console.log("Starting intro scene...");
    console.log(
      "Available scenes:",
      game.scene.getScenes().map((s) => s.scene.key)
    );

    // Check if scene exists before starting
    const introScene = game.scene.getScene("scene-intro");
    if (introScene) {
      console.log("Intro scene found, starting...");
      game.scene.start("scene-intro");
    } else {
      console.error("Intro scene not found!");
      console.log(
        "Available scenes:",
        game.scene.getScenes().map((s) => s.scene.key)
      );

      // Try to start the first available scene as fallback
      const firstScene = game.scene.getScenes()[0];
      if (firstScene) {
        console.log("Starting fallback scene:", firstScene.scene.key);
        game.scene.start(firstScene.scene.key);
      }
    }
  }, 100); // Small delay to ensure scenes are initialized

  console.log("Game initialized successfully");

  // Add timeout to check if scene started
  setTimeout(() => {
    const loading = document.getElementById("loading");
    if (loading && !loading.classList.contains("hidden")) {
      console.warn("Scene may not have started properly");
      loading.innerHTML = `
        <h2>🌱 NASA Farming Game</h2>
        <p style="color: #ffaa00;">Scene may not have started properly</p>
        <p>Check console for errors. Try refreshing the page.</p>
        <button onclick="location.reload()" style="padding: 10px 20px; background: #00ff00; color: #000; border: none; cursor: pointer;">Refresh Page</button>
      `;
    }
  }, 5000);
} catch (error) {
  console.error("Failed to initialize game:", error);
  document.getElementById("loading").innerHTML = `
    <h2>🌱 NASA Farming Game</h2>
    <p style="color: #ff4444;">Failed to initialize game: ${error.message}</p>
    <p>Please check the console for more details.</p>
  `;
}
