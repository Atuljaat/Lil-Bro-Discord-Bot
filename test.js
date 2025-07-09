const sendMsg = async (Msg) => {
    try {
        const response = await fetch("https://ai.hackclub.com/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                messages: [
                    {
                        role: "user",
                        content: String(Msg),
                    },
                ],
            }),
        });

        if (response.ok) {
            const json = await response.json();
            const msg = json.choices[0].message.content;
            console.log(msg);
            return msg;
        } else {
            console.log("API error : ", response.status);
            return null;
        }
    } catch (err) {
        console.log("Fetch Error : ", err);
        return null;
    }
};

sendMsg("Hello how are you");
