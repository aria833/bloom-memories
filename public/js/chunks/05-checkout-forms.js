function renderCheckoutShippingForm(country) {
  return `
          <section class="surface checkout-panel">
            <h2>收件資訊</h2>

            <form id="checkoutForm">
              <div class="form-grid">
                <div class="form-field">
                  <label class="field-label" for="checkoutName">
                    收件人姓名(必填)
                  </label>
                  <input
                    class="form-control"
                    id="checkoutName"
                    required
                    value="${escapeHTML(state.user.name)}"
                  >
                </div>

                <div class="form-field">
                  <label class="field-label" for="checkoutEmail">
                    電子郵件(必填)
                  </label>
                  <input
                    class="form-control"
                    id="checkoutEmail"
                    type="email"
                    required
                    value="${escapeHTML(state.user.email)}"
                  >
                </div>

                <div class="form-field full">
                  <label class="field-label" for="checkoutAddress">
                    地址(必填)
                  </label>
                  <input
                    class="form-control"
                    id="checkoutAddress"
                    required
                    placeholder="街道、門牌、樓層"
                  >
                </div>

                <div class="form-field">
                  <label class="field-label" for="checkoutPhone">
                    聯絡電話(必填)
                  </label>
                  <input
                    class="form-control"
                    id="checkoutPhone"
                    type="tel"
                    autocomplete="tel"
                    placeholder="國碼＋電話"
                  >
                </div>

                <div class="form-field">
                  <label class="field-label" for="checkoutCountry">
                    配送目的地(必填)
                  </label>

                  <select class="form-select" id="checkoutCountry">
                    <option
                      ${country === "日本" ? "selected" : ""}
                    >日本</option>

                    <option
                      ${country === "台灣" ? "selected" : ""}
                    >台灣</option>

                    <option
                      ${country === "其他地區" ? "selected" : ""}
                    >其他地區</option>
                  </select>
                </div>

                <div class="form-field">
                  <label class="field-label" for="checkoutPostal">
                    郵遞區號(必填)
                  </label>
                  <input
                    class="form-control"
                    id="checkoutPostal"
                    required
                  >
                </div>
              </div>
            </form>
          </section>
  `;
}
function renderCheckoutPaymentSection() {
  return `
          <section class="surface checkout-panel">
            <h2>付款方式</h2>

            <label class="radio-card">
              <input
                type="radio"
                name="checkoutPayment"
                checked
              >
              <span>
                <strong>
                  <i class="bi bi-credit-card me-2"></i>
                  信用卡（模擬）
                </strong>
                <small>
                  本原型不會要求輸入或保存真實卡號。
                </small>
              </span>
            </label>

            <div class="alert alert-warning small mt-3">
              客製化印刷商品不提供一般退貨；訂單進入製作流程後即不得取消。
              此為原型政策假設，正式營運前須依法確認。
            </div>
          </section>
  `;
}
