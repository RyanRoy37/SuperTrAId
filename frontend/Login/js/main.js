document.addEventListener("DOMContentLoaded", function() {
    const kiteBtn = document.querySelector(".kite-btn");
    kiteBtn.addEventListener("click",  async function(e) {
        e.preventDefault();

        let attempts=0;
        const maxattempts=5;
        async function tryFetchloginurl(){
            attempts++;
            try {
                const response =await fetch ("http://localhost:5000/sign_in");

                if (!response.ok){
                    throw new Error("HTTP error "+ response.status);
                }
                    const data =await response.json(); 

                    if (data.url) {
                        window.location.href= data.url;
                        return;
                    }

                    if (atempts < maxattempts) {
                        console.warn("URL not received. Retrying...("+ attempts + "/" + maxAttempts +")"); 
                        setTimeout(tryFetchloginurl, 500);
                    }
                    else {
                        document.write(`
                        <h2 style="font-family: Arial; color: red;">
                            ⚠️ Unable to sign in<br>
                            Backend did not return a valid login URL.
                        </h2>
                        <p style="font-family: Arial;">
                            Please try again later or contact support.
                        </p>
                    `);
                    }

 
                } 
                catch (error) {
                    if (attempts < maxattempts) {
                    console.warn("Error occurred. Retrying... (" + attempts + ")", error);
                    setTimeout(tryFetchloginurl, 500);
                } else {
                    document.write(`
                        <h2 style="font-family: Arial; color: red;">
                            ⚠️ Sign-in failed
                        </h2>
                        <p style="font-family: Arial;">
                            Error: ${error.message}<br>
                            Please try again.
                        </p>
                    `);
                }
                }
            }
            tryFetchloginurl();
        });
    });
        


