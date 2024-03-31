import { create } from "zustand";
// import { ReceivedMsg } from "@/views/messages/RightContainer";
import { produce } from "immer";
import { MsgType } from "@/views/messages/RightContainer";
type receivedMsg = Omit<MsgType, "isMe">;

type MessageState = {
  messages: Map<string, receivedMsg[]>;
  totalMessage: number;
  currentChatingMsg: receivedMsg | null; //当前实时聊天消息
  setCurrentChatingMsg: (msg: receivedMsg) => void;

  friendList: any[];
  cacheMessage: (msg: receivedMsg) => void; //缓存消息（未读）
  consumeMessage: (key: receivedMsg["from"]) => void; //消费消息（已读）
  increment: () => void;
  decrement: (num: number) => void;
};

const useMessageStore = create<MessageState>()((set, get) => ({
  messages: new Map(),
  totalMessage: 0,
  friendList: [],
  currentChatingMsg: {},
  setCurrentChatingMsg: (curMsg) => set({ currentChatingMsg: curMsg }),

  cacheMessage: (msg) =>
    //@ts-ignore
    set((state) => {
      const pre = state.messages;
      const key = msg["from"];
      get().increment();
      return {
        messages: produce(pre, (draft) => {
          if (draft.has(key!)) {
            const targetMsg = draft.get(key!);
            targetMsg!.push(msg);
          } else {
            draft.set(key!, [msg]);
          }
        }) as Map<string, receivedMsg[]>,
      };
    }),

  consumeMessage: (key) => {
    const currentState = get().messages;
    const num = currentState.has(key!) ? currentState.get(key!)?.length : 0;
    if (num) get().decrement(num);
    console.log("num:", num);
    //@ts-ignore
    set((state) => ({
      messages: produce(state.messages, (draft) => {
        if (draft.has(key!)) {
          draft.delete(key!);
        }
      }),
    }));
  },
  increment: () => set((state) => ({ totalMessage: state.totalMessage + 1 })),
  decrement: (num) =>
    set((state) => ({ totalMessage: state.totalMessage > 0 ? state.totalMessage - num : 0 })),
}));

export default useMessageStore;
