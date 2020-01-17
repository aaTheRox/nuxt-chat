
export const utils = {
    formatDate: (timestamp) => {
    let msPerMinute = 60 * 1000,
        msPerHour = msPerMinute * 60,
        msPerDay = msPerHour * 24,
        msPerMonth = msPerDay * 30,
        msPerYear = msPerDay * 365,
        current = Date.now();

    let elapsed = current - timestamp;
    let state;
     if(elapsed < msPerMinute) {
       if(Math.round(elapsed/1000) <= 60) {
          state = 'hace un momento';  
       }
     }
     else if(elapsed < msPerHour) {
       state = `hace ${Math.round(elapsed/msPerMinute)} minuto`;  
     }

     else if(elapsed < msPerDay) {
       if(Math.round(elapsed/msPerHour)==1) {
        state = 'hace una hora';  
       } else {
        state = `hace ${Math.round(elapsed/msPerHour)} horas`;  
       }
     }
     else if (elapsed < msPerMonth) {
        if(Math.round(elapsed/msPerDay)==1) {
        state = 'hace un día';  
       } else {
        state = `hace ${Math.round(elapsed/msPerDay)} dias`;  
       }
    }
     return state;
    },
    /**
     * Checks if server token is equal to browserToken
     */
    checkAuthToken: (token, browserToken) =>{
      return (token===browserToken) ? true : false;
    }


}

