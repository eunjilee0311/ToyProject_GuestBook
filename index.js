const BASE_URL = "http://3.34.73.84:8000/guestbook/";

//방명록 전체 불러오기 (GET)
async function fetchGuestbooks() {
    const res = await fetch(BASE_URL);
    const data = await res.json();
    console.log(data);
    if (data.status === 200) {
        renderGuestBookList(data.data);
    } else {
        alert("방명록 불러오기 실패");
    }
}

//방명록 하나 저장학 (POST)
async function createGuestbook(name, title, content, password) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({name, title, content, password }),
        });

    const data = await res.json();
    if (data.status === 200) {
        //alert("방명록 저장 성공!");
        fetchGuestbooks();
    } else {
        alert("방명록 저장 실패");
    }
}

//방명록 삭제하기 (DELETE)
async function deleteGuestbook(id, password) {
    const res = await fetch(`${BASE_URL}${id}/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({password }),
        });
    
    const data  = await res.json();
    if (data.status === 200) {
        //alert("삭제 성공");
        fetchGuestbooks();
    } else {
        alert(data.message);
    }
}

//화면에 랜더링
function renderGuestBookList(entries) {
    const list = document.getElementById("list");
    list.innerHTML = "<h2>🏷️ 남겨진 기록들</h2>"

    entries.forEach((entry) => {
        const div = document.createElement("div");
        div.classList.add("entry");

        div.innerHTML = `
            <p><strong>${entry.name}</strong> <span style="color:gray;">(${entry.created})</span></p>
            <p><strong>제목:</strong> ${entry.title}</p>
            <hr>
            <p><strong></strong> ${entry.content}</p>
            <input type="password" class="delete-password" placeholder="비밀번호" />
            <button class="delBtn" data-id="${entry.id}">삭제</button>
        `;

        list.appendChild(div);
    });

    document.querySelectorAll(".delBtn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = e.target.dataset.id;
            const passwordInput = e.target.previousElementSibling;
            const password  = passwordInput.value;

            deleteGuestbook(id, password);
        });
    });
}

//저장 버튼 핸들링
document.querySelector("#saveBtn").addEventListener("click", () => {
    // 입력한 내용 가져오기
    const name = document.getElementById("name").value;
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const password = document.getElementById("password").value;
    
    if (!name || !title || !content || !password) {
        alert("모든 항목을 입력해주세요!");
        return;
    }

    createGuestbook(name, title, content, password);

    // 입력칸 초기화
    document.getElementById("name").value = "";
    document.getElementById("title").value = "";
    document.getElementById("content").value = "";
    document.getElementById("password").value = "";
});

//처음 실행 시 방명록 목록 불러오기
window.onload = fetchGuestbooks;