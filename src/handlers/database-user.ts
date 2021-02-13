import { handler as cfnResourceHandler } from './database-user/database-user-creation';
import { handler as eventBridgeHandler } from './database-user/database-user-updater';

export const handler = async (event: any, context: any) => {
  if (event.RequestType) {
    // then we've got a CfnResource
    return cfnResourceHandler(event, context);
  }
  if (event.source) {
    // then we assume an EventBridge message
    return eventBridgeHandler(event);
  }
};