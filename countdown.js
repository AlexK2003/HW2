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

async function startCountdown() {
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
        display.innerText = formatTime(i);
        await sleep(1000);
    }
    finishedCountdown();


}

