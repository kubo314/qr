let shopping_data = [];
if (localStorage.getItem("incomplete")) {
    shopping_data = JSON.parse(atob(localStorage.getItem("incomplete")));
        const total = shopping_data[0].reduce(function(sum, element){
        return sum + element;
    }, 0);
    const isFoundMinus = shopping_data[0].some(num => num < 0);
    if (total == 0) {
        show_toast_message("商品が一つも選択されていません。")
    } else if (isFoundMinus) {
        show_toast_message("商品の個数が不正です。");
    } else {
        const str = JSON.stringify(shopping_data);
        const base64_str = btoa(str);
        console.log(base64_str)
        new QRCode(document.querySelector("#qrcode"), base64_str);
        const value = shopping_data[1];
        document.querySelector("#qrcode").insertAdjacentHTML("beforeend", `<span class="font_x_large">注文ID:${shopping_data[2]}</span><div class="space"></div><span class="font_xxx_large">¥${value}</span><button class="normal_button completion">素早く3回押して元の画面に戻る</button><span style="font-size:small;">※注文後受け取り前に行うと注文が無効となります。</span>`);
        document.body.style.overflow = "hidden";
        document.querySelector(".mordal_box").classList.toggle("flex_center");
        add_triple_event();
    }
} else{
    shopping_data = [[0, 0, 0, 0, 0], 0, get_unique_id()];
}
const selection_elems = [...document.querySelectorAll(".selection")];
const total_value_elem = document.querySelector("#total_value");
document.querySelectorAll(".quantity_button").forEach(e => {
    e.addEventListener("click", function () {
        
        const indicator_elem = e.parentElement.querySelector(".indicator");
        const selection_elem = e.parentElement.parentElement;
        const index_of_selection_elem = selection_elems.indexOf(selection_elem);
        const value_of_item = Number(selection_elem.querySelector(".value_of_item").textContent);
        let quantity = 0;
        if (e.classList.contains("minus")) {
            quantity = Number(indicator_elem.textContent) - 1;
            if (Number(indicator_elem.textContent) == 0) { return; }
            total_value_elem.textContent = Number(total_value_elem.textContent) - value_of_item;
        } else {
            quantity = Number(indicator_elem.textContent) + 1;
            total_value_elem.textContent = Number(total_value_elem.textContent) + value_of_item;
        }
        shopping_data[1] = Number(total_value_elem.textContent);
        indicator_elem.textContent = quantity;
        shopping_data[0][index_of_selection_elem] = quantity;
    });
});

document.querySelector(".button_to_show_qr").addEventListener("click", function () {
    const total = shopping_data[0].reduce(function(sum, element){
        return sum + element;
    }, 0);
    const isFoundMinus = shopping_data[0].some(num => num < 0);
    if (total == 0) {
        show_toast_message("商品が一つも選択されていません。")
        return;
    } else if (isFoundMinus) {
        show_toast_message("商品の個数が不正です。");
        return;
    }
    const str = JSON.stringify(shopping_data);
    const base64_str = btoa(str);
    console.log(base64_str)
    new QRCode(document.querySelector("#qrcode"), base64_str);
    const value = shopping_data[1];document.querySelector("#qrcode").insertAdjacentHTML("beforeend", `<span class="font_x_large">注文ID:${shopping_data[2]}</span><div class="space"></div><span class="font_xxx_large">¥${value}</span><button class="normal_button completion">素早く3回押して元の画面に戻る</button><span style="font-size:small;">※注文後受け取り前に行うと注文が無効となります。</span>`);
    document.body.style.overflow = "hidden";
    document.querySelector(".mordal_box").classList.toggle("flex_center");

    localStorage.setItem("incomplete", base64_str);
    add_triple_event();
})

function get_yyyy_mm_dd() {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = date.getMonth();
    const dd = date.getDate();
    return new Date(yyyy, mm, dd);
}

function get_unique_id() {
    return (new Date().getTime() - get_yyyy_mm_dd().getTime()).toString(10+26).toUpperCase();
}
function show_toast_message(message) {
    new JSFrame().showToast({
        html: message, align: "top", duration: 2000
    });
}

function add_triple_event() {
    let tapCount = 0;
    let lastTapTime = 0;
    const TAP_DELAY = 400; // タップ間の最大間隔（ミリ秒）

    document.querySelector(".completion").addEventListener('touchend', (event) => {
        const currentTime = new Date().getTime();

        if (currentTime - lastTapTime < TAP_DELAY) {
            tapCount++;
        } else {
            tapCount = 1;
        }

        lastTapTime = currentTime;

        if (tapCount >= 3) {
            localStorage.removeItem("incomplete");
            document.querySelector(".mordal_box").classList.toggle("flex_center");
            document.body.style.overflow = "";
            window.location.reload();
            tapCount = 0; // リセット
        }
    });
}