const socket = io();

const loginForm = document.querySelector("#welcome-form");
const messagesSection = document.querySelector("#messages-section");
const messagesList = document.querySelector("#messages-list");
const addMessageForm = document.querySelector("#add-messages-form");
const userNameInput = document.querySelector("#username");
const messageContentInput = document.querySelector("#message-content")

/* socets */
socket.on('message', ({ author, content }) => addMessage(author, content));

let userName = '';

/* login form */
loginForm.addEventListener('submit', login = (event) => {
    if(userNameInput.value){
    event.preventDefault();
    userName = userNameInput.value; //get value from username imput
    loginForm.classList.remove('show'); //remove class 'show' from login form 
    messagesSection.classList.add('show'); //add class 'show' to messages section
    } else {
        alert('You need to log in...!');
    };
});

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
addMessageForm.addEventListener('submit', sendMessage = (event) => {
  event.preventDefault();

  let messageContent = messageContentInput.value;

  if(messageContentInput.value){
    addMessage(userName, messageContentInput.value);
    socket.emit('message', { author: userName, content: messageContent })
    messageContentInput.value = '';
    } else {
        alert('You need to type your message...')
    }
});


