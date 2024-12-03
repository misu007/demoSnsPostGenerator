public with sharing class DemoSnsPostGeneratorController {
  @AuraEnabled
  public static string getGeneratedText(String prompt, String modelName) {
    aiplatform.ModelsAPI.createGenerations_Request request = new aiplatform.ModelsAPI.createGenerations_Request();
    request.modelName = modelName;
    aiplatform.ModelsAPI_GenerationRequest requestBody = new aiplatform.ModelsAPI_GenerationRequest();
    request.body = requestBody;
    requestBody.prompt = prompt;
    try {
      aiplatform.ModelsAPI modelsAPI = new aiplatform.ModelsAPI();
      aiplatform.ModelsAPI.createGenerations_Response response = modelsAPI.createGenerations(
        request
      );
      return response.Code200.generation.generatedText;
    } catch (aiplatform.ModelsAPI.createGenerations_ResponseException ex) {
      System.debug('The following exception occurred: ' + ex);
    }
    return '生成できませんでした。もう一度お試しください。';
  }
}
