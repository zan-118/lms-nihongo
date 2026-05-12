const Kuroshiro = require("kuroshiro").default;
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");

async function test() {
  console.log("Starting Kuroshiro Test...");
  const kuroshiro = new Kuroshiro();
  
  try {
    console.log("Initializing Analyzer...");
    // Kuromoji needs to find the dict. In node_modules, it's usually at:
    // node_modules/kuromoji/dict
    await kuroshiro.init(new KuromojiAnalyzer());
    console.log("Initialization Successful!");
    
    const result = await kuroshiro.convert("昔々、あるところに、おじいさんとおばあさんが住んでいました。", {
      to: "hiragana",
      mode: "normal"
    });
    
    console.log("Conversion Result:", result);
  } catch (error) {
    console.error("Test Failed:", error);
  }
}

test();
