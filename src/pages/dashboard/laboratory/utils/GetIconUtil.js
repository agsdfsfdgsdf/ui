export default function getIcon(item) {
  const { name, icon, url } = item;
  let iconPath = '/' + icon;
  let route = '/' + url.replace('/index', '');
  return { name: name, icon: iconPath, route: route };
}
