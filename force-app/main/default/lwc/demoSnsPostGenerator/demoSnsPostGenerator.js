import { LightningElement, api, wire } from "lwc";
import getGeneratedText from "@salesforce/apex/DemoSnsPostGeneratorController.getGeneratedText";
import { getRecord } from "lightning/uiRecordApi";
const FIELDS = ["Product2.Description"];

export default class DemoSnsPostGenerator extends LightningElement {
  @api recordId;
  @api systemPrompt;
  @wire(getRecord, { recordId: "$recordId", fields: FIELDS }) product2;
  isLoading = false;

  content = "投稿文章..";
  modelOptions = [
    { label: "OpenAI GPT-4-Omni", value: "sfdc_ai__DefaultOpenAIGPT4Omni" },
    {
      label: "Anthoropic Claude-3-Haiku",
      value: "sfdc_ai__DefaultBedrockAnthropicClaude3Haiku"
    }
  ];

  get writingLanguages() {
    return ["日本語", "英語"].map((val) => ({ label: val, value: val }));
  }

  get writingStyles() {
    return ["カジュアル", "フォーマル", "ポエム風", "クイズ形式"].map(
      (val) => ({ label: val, value: val })
    );
  }

  async clickedGenerate() {
    this.isLoading = true;
    this.content = "...";
    const modelName = this.refs.llm.value;
    const prompt = this.createPrompt();
    const payload = { prompt, modelName };
    this.content = await getGeneratedText(payload);
    this.isLoading = false;
  }

  createPrompt() {
    const prompt = `
${this.systemPrompt}
以下の商品情報、ユーザーからのリクエストに応じたコンテンツを作成します。

商品情報: """
${this.product2.data.fields.Description.value}
"""

ユーザーからのリクエスト: """
- トピック: ${this.refs.topic.value} 
- コンテンツの言語: ${this.refs.language.value}
- 文章の文字数の目安: ${this.refs.length.value}
- 文体: ${this.refs.style.value}
- ハッシュタグの数（この数だけハッシュタグを文末につけて）: ${this.refs.hashTags.value}
"""

コンテンツ:
`;
    return prompt;
  }

  get formattedContent() {
    if (this.content) {
      return this.content
        .replace(/#/, "<br/><br/>#")
        .replace(/(#\S+)/g, '<a href="">$1</a> ');
    }
    return "";
  }
}
