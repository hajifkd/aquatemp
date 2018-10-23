function showLoginModal() {
    let modal = $("#loginModal");
    let button = $("#loginButton");

    button.click(() => {
        let email = $("#email").val();
        let password = $("#password").val();

        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
            modal.modal();
            // [END_EXCLUDE]
        }).then(showTemps);
    });

    modal.modal();
}

async function showTemps() {
    let now = new Date();
    let yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    let data = await getData(yesterday, now);

    data = Object.keys(data).map(k => data[k]).sort((a, b) => a.created_at > b.created_at);
    console.log(data);

    let chart = document.getElementById("tempChart").getContext('2d');
    let _tempChart = new Chart(chart, {
        "type": "line",
        "data": {
            "labels": data.map(e => {
                let date = new Date(e.created_at);
                return ('0' + date.getHours()).substr(-2) + ":00";
            }),
            "datasets": [
                {
                    "label": "Temperature",
                    "data": data.map(e => e.temp),
                    "fill": false,
                }
            ]
        },
        "options": {
            "responsive": true,
            "maintainAspectRatio": true
        }
    });
}

function getData(startDate, endDate) {
    let promise = new Promise(resolve =>
        firebase
            .database()
            .ref("temps")
            .orderByChild('created_at')
            .startAt(startDate * 1)
            .endAt(endDate * 1)
            .on('value', s => {
                let values = s.val();
                resolve(values);
            })
    );

    return promise;
}

function main() {
    if (!firebase.auth().currentUser) {
        showLoginModal();
    }
}

$(main)