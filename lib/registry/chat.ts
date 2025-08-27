import type {ImageSourcePropType} from 'react-native';

const chat01 = require('../../assets/images/chat/chat-01.png');
const chat02 = require('../../assets/images/chat/chat-02.png');
const chat03 = require('../../assets/images/chat/chat-03.png');
const chat04 = require('../../assets/images/chat/chat-04.png');
const chat05 = require('../../assets/images/chat/chat-05.png');

const byConvId: Record<string, ImageSourcePropType> = {
  c1: chat01,
  c2: chat02,
  c3: chat03,
  c4: chat04,
  c5: chat05,
};

export function getChatAvatarForConv(convId: string): ImageSourcePropType | undefined {
  return byConvId[convId];
}
