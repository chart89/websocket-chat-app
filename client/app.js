const loginForm = document.querySelector("#welcome-form");
const messagesSection = document.querySelector("#messages-section");
const messagesList = document.querySelector("#messages-list");
const addMessageForm = document.querySelector("#add-messages-form");
const userNameInput = document.querySelector("#username");
const messageContentInput = document.querySelector("#message-content")
const welcomeTextDiv = document.querySelector("#welcome-text");

let userName = '';
const welcomeMessage = [' has joined the conversation!', ' has left the conversation... :('];

/* socets */
const socket = io();
socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('user', ({user}) => addMessage('CHAT BOT', '<i>' + user + welcomeMessage[0] + '</i>' ));
socket.on('removeUser', (user) => addMessage('CHAT BOT', '<i>' + user + welcomeMessage[1] + '</i>'));


/* login form */
const login = (e) => {
  if(userNameInput.value){
  e.preventDefault();
  userName = userNameInput.value; //get value from username imput
  socket.emit('user', { user: userName});
  loginForm.classList.remove('show'); //remove class 'show' from login form 
  messagesSection.classList.add('show'); //add class 'show' to messages section
  } else {
      alert('You need to log in...!');
  };
};

/* add eventListerner for login form */
loginForm.addEventListener('submit', () => {
  login(event);
});

/* function to create HTML code inside messages list */
const addMessage = (author, content) => {
    const message = document.createElement('li');
    message.classList.add('message');
    message.classList.add('message--received');
    if(author === userName) message.classList.add('message--self');
    message.innerHTML = `
      <h3 class="message__author">${userName === author ? 'You' : author }</h3>
      <div class="message__content">
        ${content}
      </div>
    `;
    messagesList.appendChild(message);
  };


/* add messages form */

const sendMessage = (e) => {
  e.preventDefault();

  let messageContent = messageContentInput.value;

  if(messageContentInput.value){
    addMessage(userName, messageContentInput.value);
    socket.emit('message', { author: userName, content: messageContent });
    messageContentInput.value = '';
    } else {
        alert('You need to type your message...')
    }
};

/* add eventListener for messages form */
addMessageForm.addEventListener('submit', () => {
  sendMessage(event);
});


