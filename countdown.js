let paused = false;
let reset = false;
let counting = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return (
        hrs.toString().padStart(2, "0") + ":" +
        mins.toString().padStart(2, "0") + ":" +
        secs.toString().padStart(2, "0")
    );
}

function finishedCountdown() {
    alert("Countdown finished!");
}

function resetCountdown() {
    reset = true;
    paused = false;
    if(!counting) {
        reset = false;
        display.innerText = formatTime(0);
        counting = false;
    }
}

async function startCountdown() {
    counting = true;
    let display = document.getElementById("countdown");
    const unit = document.querySelector('input[name="unit"]:checked').value;

    let countdownTime = parseInt(document.getElementById("countdownvalue").value, 10);
    if(unit == "hour") {
        countdownTime *= 3600;
    }
    else if(unit == "minute") {
        countdownTime *= 60;
    }

    for(let i = countdownTime; i > -1; i--) {
        if(paused) {
            i++;
            await sleep(1000);
            continue;
        }

        if(reset) {
            reset = false;
            display.innerText = formatTime(0);
            console.log("reset");
            counting = false;
            return;
        }
        display.innerText = formatTime(i);
        await sleep(1000);
    }
    finishedCountdown();
    counting = false;


}

