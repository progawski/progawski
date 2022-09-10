/* Assign constant variables */

const fullname = document.querySelector('#name');
const email = document.querySelector('#email');
const sendBtn = document.querySelector('#send-btn');
const spinnerBtn = document.querySelector('.spinner-btn');
const btnText =  document.querySelector('#send-btn span');
const message = document.querySelector("#message");
const messageLimit = document.querySelector("#message-limit");
const contactForm = document.querySelector("#contact-form");
const contactFormCol = document.querySelector("#contact-form .contact-col:first-child");

const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const mediaQuery = window.matchMedia('(max-width: 576px)');

/* Show message limit text and the current number of entered characters*/
messageLimit.textContent = message.value.length + '/' + message.getAttribute("maxlength");

/* Send message using ajax */
const sendMessage = () => {

    let formError = false;

    /* Check if email has valid format and if the other fields are not empty */
    if(!email.value.match(mailFormat)){
        email.classList.add('error');
        formError = true;
    }
    if(fullname.value === ''){
        fullname.classList.add('error');
        formError = true;
    }
    if(message.value === ''){
        message.classList.add('error');
        formError = true;
    }
    
    /* If there is no error caused by above, execute ajax */
    if(!formError){
        $.ajax({
            url: "contact.php",
            method: "POST",
            dataType: "json",
            data: {
                fullname: fullname.value,
                email: email.value,
                message: message.value
            },
            beforeSend: function() {
                /* Disable form's elements and show animated spinner */
                spinnerBtn.style.display = 'block';
                btnText.textContent = 'Sending...';
                fullname.setAttribute('disabled', '');                
                email.setAttribute('disabled', ''); 
                message.setAttribute('disabled', '');
                sendBtn.setAttribute('disabled', ''); 
            }
        }).done(function(data){
    
            /* Validation based on server response */
            if(data[0].nameEmpty || data[0].emailEmpty || data[0].contentEmpty || data[0].emailInvalid){
                if(data[0].nameEmpty){
                    fullname.classList.add('error');
                }
                if(data[0].emailEmpty || data[0].emailInvalid){
                    email.classList.add('error');
                }
                if(data[0].contentEmpty){
                    message.classList.add('error');
                }
               
                btnText.textContent = 'Send message';

            } else{
                btnText.textContent = 'Message sent!';
                fullname.value = '';
                email.value = '';
                message.value = '';

                messageLimit.textContent = message.value.length + '/' + message.getAttribute("maxlength");
            }
            /* Enable form's elements and hide spinner*/
            fullname.removeAttribute('disabled');
            email.removeAttribute('disabled');
            message.removeAttribute('disabled');
            sendBtn.removeAttribute('disabled');

            spinnerBtn.style.display = 'none';
    
        }).fail(function(){
            btnText.textContent = 'Send message';
            spinnerBtn.style.display = 'none';
            fullname.removeAttribute('disabled');
            email.removeAttribute('disabled');
            message.removeAttribute('disabled');
            alert('Something went wrong! Try again later...');
        });
    }
}

/* Check entered characters in the textarea */
const checkMsgLimit = () => {
    messageLimit.textContent = message.value.length + '/' + message.getAttribute("maxlength");

    if(message.value.length == message.getAttribute("maxlength")){
        messageLimit.style.color = '#d40000';
    } else{
        messageLimit.style.color = '#fff';
    }
}

/* Clear input when typing in form's field after error occured */
const clearForm = (e) => {
    if(e.target.classList.contains('error')){
        e.target.classList.remove('error');
    }
    if(btnText.textContent === 'Message sent!'){
        btnText.textContent = 'Send message';
    }
}


/* Change contact form layout for smaller resolution */
const resolutionChange = (e) => {
    if(e.matches){
        contactFormCol.querySelector('button').remove();
        contactForm.append(sendBtn);
    } else{
        contactForm.querySelector('button').remove();
        contactFormCol.append(sendBtn);
    }
}

resolutionChange(mediaQuery);

/* Add event listeners */

sendBtn.addEventListener('click', sendMessage);
message.addEventListener('input', checkMsgLimit);
message.addEventListener('input', clearForm);
email.addEventListener('input', clearForm);
fullname.addEventListener('input', clearForm);
mediaQuery.addEventListener('change', resolutionChange);
