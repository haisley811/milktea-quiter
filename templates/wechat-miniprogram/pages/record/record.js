import { estimateDrinkSmart } from "../../services/aiEstimate.js";

const defaultForm = {
  mode: "saved",
  drinkType: "奶茶",
  drinkName: "珍珠奶茶",
  size: "中杯",
  ice: "少冰",
  sugar: "半糖",
  toppings: ["波霸"],
  customTopping: ""
};

Page({
  data: {
    form: defaultForm,
    estimate: null,
    isEstimating: false,
    drinkTypes: ["奶茶", "果茶", "咖啡"],
    sizes: ["小杯", "中杯", "大杯"],
    iceOptions: ["正常冰", "少冰", "去冰", "热"],
    sugarOptions: ["正常糖", "少糖", "半糖", "微糖", "无糖"],
    toppingOptions: [
      { name: "波霸", selected: true },
      { name: "茶冻", selected: false },
      { name: "椰果", selected: false },
      { name: "芋圆", selected: false }
    ]
  },

  onLoad() {
    this.refreshEstimate();
  },

  updateForm(next) {
    this.setData({
      form: {
        ...this.data.form,
        ...next
      }
    });
  },

  onDrinkNameInput(event) {
    this.updateForm({ drinkName: event.detail.value });
  },

  onCustomToppingInput(event) {
    this.updateForm({ customTopping: event.detail.value });
  },

  chooseDrinkType(event) {
    this.updateForm({ drinkType: event.currentTarget.dataset.value });
  },

  chooseSize(event) {
    this.updateForm({ size: event.currentTarget.dataset.value });
  },

  chooseIce(event) {
    this.updateForm({ ice: event.currentTarget.dataset.value });
  },

  chooseSugar(event) {
    this.updateForm({ sugar: event.currentTarget.dataset.value });
  },

  toggleTopping(event) {
    const value = event.currentTarget.dataset.value;
    const toppingOptions = this.data.toppingOptions.map((item) => (
      item.name === value ? { ...item, selected: !item.selected } : item
    ));

    this.setData({ toppingOptions });
    this.updateForm({
      toppings: toppingOptions.filter((item) => item.selected).map((item) => item.name)
    });
  },

  submitEstimate() {
    this.refreshEstimate();
  },

  refreshEstimate() {
    if (this.data.isEstimating) return;

    this.setData({ isEstimating: true });
    estimateDrinkSmart(this.data.form)
      .then((estimate) => {
        this.setData({ estimate });
      })
      .finally(() => {
        this.setData({ isEstimating: false });
      });
  }
});
