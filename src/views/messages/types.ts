export interface IGroup {
  _id?: string;
  maxMember?: number;
  members?: string[];
  GroupHost?: string;
  admins?: string[];
  groupName?: string;
  groupAvatar?: string;
  groupDescription?: string;
}

export interface IGroupMsg {
  _id?: string;
  goupId?: string;
  senderId?: string;
  msg?: string;
  isSystemMsg?: boolean;
  time?: string;
  isReadMember?: string[];
  userDelete?: string[];
}

export type IUserInfo = {
  _id: string;
  nick_name?: string;
  account: string;
  email: string;
  isAvatarImageSet?: boolean;
  avatarImage?: string;
  birthday?: string;
  phone?: string;
  phone_prefix?: string;
  gender?: string;
  role?: string;
  signature?: string;
};

export type IMessage = {
  _id: string;
  from: string;
  to: string;
  msg: string;
  isSystemMsg: boolean;
  time: string;
  isRead: boolean;
  userDelete: string[];
};

export type IFriendShip = {
  _id?: string;
  userId?: string;
  friendId?: string; 
  status?: string;//好友关系状态
  remark?: string; //备注
  applyMsg?: string;
  isApplyer?: boolean;
  isAccepter?: boolean;
  lastMsg?: string;
  lastTime?: string;
  msg_mention?: boolean;
  msg_top?: boolean;
};
