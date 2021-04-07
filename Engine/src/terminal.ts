import System from "./system";

function print(message: string) {
    console.log(message);
}

export default class Terminal extends System {
  static showFullData: boolean;

  constructor() {
      super();
      this.sysName = "Terminal";
      Terminal.showFullData = false;
  }

  activate() {
      if (this.getStatus() !== "Online") {
          this.newSubscription(this.channel.subscribe({
              topic: "#",
              callback(data: any, envelope: any) {
                  print(`[${envelope.timeStamp}]: ${envelope.topic}`);
                  if (Terminal.showFullData) {
                      print(data);
                  }
              },
          }));
          // Always show Error data, regardless of settings
          this.newSubscription(this.channel.subscribe({
              topic: "Error.#",
              callback(data: any) {
                  if (!Terminal.showFullData) {
                      print(data);
                  }
              },
          }));
          super.activate();
      }
  }

  deactivate() {
      super.deactivate();
      this.clearSubscriptions();
  }

  showData(show: boolean) {
      Terminal.showData(show);
      this.channel.publish(
          "Systems.Terminal.ShowFullData",
          {
              showBool: show,
          },
      );
  }

  static showData(show: boolean) {
      Terminal.showFullData = show;
  }
}
