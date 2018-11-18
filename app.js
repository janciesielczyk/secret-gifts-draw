
var results = {};
var names = [];
var m = new MersenneTwister();
var kasiaFeatureEnabled = true;

function draw() {
    blockNames();
    var nameInputs = document.getElementsByClassName('nameInput');

    for (var i=0; i < nameInputs.length; i++) {
        results[nameInputs[i].value] = '';
        names.push(nameInputs[i].value);
    }

    if(kasiaFeatureEnabled) {
        results['Daria'] = 'Kasia';
        var index = names.indexOf('Kasia');
        if (index !== -1) {
            names.splice(index, 1);
        }
    }

    for (var key in results) {
        if (results.hasOwnProperty(key) && results[key] === '') {
            var j=0;
            var drawnIndex;
            do{
                j++;
                drawnIndex = getRandomInt(0, names.length - 1);
            }
            while(names[drawnIndex] === key && j < 50);
            results[key] = names[drawnIndex];
            names.splice(drawnIndex, 1);
        }
    }
    console.log(results);
    addActionButtons();
}

function addName() {
    var div = document.createElement('div');
    div.className = 'participant';
    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'nameInput';
    div.appendChild(input);
    var namesContainer = document.getElementById('participants');
    namesContainer.appendChild(div);
}

function removeName() {
    var nameInputs = document.getElementsByClassName('nameInput');
    nameInputs[nameInputs.length-1].remove();
}

function blockNames() {
    var nameInputs = document.getElementsByClassName('nameInput');

    for (var i=0; i < nameInputs.length; i++) {
        nameInputs[i].disabled = true;
    }

    document.getElementById('btnRemoveName').remove();
    document.getElementById('btnAddName').remove();
    document.getElementById('btnDraw').remove();
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(m.random() * (max - min + 1)) + min;
}

function addActionButtons() {
    var nameInputs = document.getElementsByClassName('nameInput');

    for (var i=0; i < nameInputs.length; i++) {
        var button = document.createElement('button');
        button.onclick = function(e){
            showResultFor(e.target.previousSibling.value);
            return false;
        };
        button.innerHTML = '❔Result';
        insertAfter(button, nameInputs[i]);
        
        var button2 = document.createElement('button');
        button2.onclick = function(e){
            sendEmail(e.target.previousSibling.previousSibling.value, e.target);
            return false;
        };
        button2.innerHTML = '📧Send';
        insertAfter(button2, button);
    }
}

function showResultFor(name) {
    document.getElementById('giftFrom').innerHTML = name;
    document.getElementById('giftTo').innerHTML = results[name];
    document.getElementById('modal').classList.add('modal--opened');		
    setTimeout(function(){ 
        document.getElementById('modal').classList.remove('modal--opened');
    }, 3000);
}

function sendEmail(name, button) {
    var email = window.prompt('Type email address','');
    if(!validateEmail(email)) { 
        alert("Type valid email address");
        return false; 
    }

    button.innerHTML = 'Sending...';
    button.disabled = true;

    var service_id = "sendgrid";
    var template_id = "template_1oRpYHPm";

    var template_params = {
        to_email: email,
        to_name: name,
        message_html: results[name]
    }
    
    emailjs.send(service_id, template_id, template_params)
        .then(function(response) {
            button.innerHTML = 'Email Sent';
            console.log('SUCCESS!', response.status, response.text);
            alert("Sent!");
        }, function(error) {
            console.log('FAILED...', error);
            alert("Send email failed!\r\n Response:\n " + JSON.stringify(err));
        });

    return false;
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}