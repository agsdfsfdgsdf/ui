import { message } from 'antd';

export default function copyToClip(content: string, messageContent?: string) {
  const aux = document.createElement('input');
  aux.setAttribute('value', content);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand('copy');
  document.body.removeChild(aux);
  if (messageContent == null) {
    message.info('复制成功');
  } else {
    alert(messageContent);
  }
}
