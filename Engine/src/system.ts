import * as postal from "postal";

enum Status {
  Error = "Error",
  Online = "Online",
  Offline = "Offline",
}

export default class System {
      #status: Status;
      #subs: any[];
      protected sysName: string;
      protected channel: any;

      constructor() {
          this.#status = Status.Offline;
          this.sysName = "UnnamedSystem";
          this.channel = postal.channel();
          this.#subs = [];
      }

      setStatus(newStatus: Status): void {
          this.#status = newStatus;
      }

      getStatus(): Status {
          return this.#status;
      }

      activate(): void {
          this.#status = Status.Online;
          this.channel.publish(`Systems.${this.sysName}.Online`, {
              sysName: this.sysName,
              sysStatus: this.#status,
          });
      }

      deactivate(): void {
          this.#status = Status.Offline;
          this.channel.publish(`Systems.${this.sysName}.Offline`, {
              sysName: this.sysName,
              sysStatus: this.#status,
          });
          this.clearSubscriptions();
      }

      throwError(thrownStr: string): void {
          this.channel.publish("Error.Thrown", {
              sysName: this.sysName,
              errCode: thrownStr,
          });
      }

      newSubscription(sub: any): void {
          this.#subs.push(sub);
      }

      clearSubscriptions(): void {
          this.#subs.forEach((e) => e.unsubscribe());
      }
}
