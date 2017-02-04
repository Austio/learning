import Hello from './components/Hello';
import Newsfeed from './components/newsfeed/Newsfeed';


export default [
  { path: '/newsfeed', name: 'newfeed', component: Newsfeed },
  { path: '', default: true, name: 'home', component: Hello },
];
