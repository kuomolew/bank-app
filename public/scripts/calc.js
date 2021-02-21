var app = new Vue({
  el: '#app',
  data() {
    return {
      banks: {},
      currentBank: {},
      api: '/api/v1/banks',
      selectedBankId: '',
      selectedBankDownPayment: 0,
      selectedBankMonth: 0,
      selectedBankInterest: 0,
      monthlyPayment: 0,
      initialLoan: null,
      initialLoanError: false,
      selectedBankMaxLoan: 0,
      downPayment: null,
      downPaymentError: false,
      isSubmitDisabled: true,
      calculationDone: false,
      lastCalcBankName: '',
      lastCalcLoan: 0,
      lastCalcDownPayment: 0,
      lastCalcMonthlyPayment: 0,
    };
  },
  methods: {
    getAllBanks() {
      fetch(this.api)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.banks = data.data.banks;
          this.selectedBankId = data.data.banks[0]._id;
        })
        .catch((err) => {
          console.log('ERROR:', err.toString());
        });
    },
    getBank(id) {
      fetch(`${this.api}/${id}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.currentBank = data.data.bank;
          this.getSelectedBankMaxLoan();
          this.getSelectedBankMonth();
          this.checkDownPayment();
          this.checkInitialLoan();
          this.handleDisabled();
        })
        .catch((err) => {
          console.log('ERROR:', err.toString());
        });
    },
    getSelectedBankMaxLoan() {
      this.selectedBankMaxLoan = this.currentBank.maxLoan;
    },
    getSelectedBankMonth() {
      this.selectedBankMonth = this.currentBank.term;
    },
    calculateMinDownPayment() {
      this.selectedBankDownPayment =
        (this.initialLoan * this.currentBank.minDownPayment) / 100;
    },
    calculate() {
      this.selectedBankInterest = this.currentBank.interest / 100;
      this.monthlyPayment =
        (this.initialLoan *
          (this.selectedBankInterest / 12) *
          (1 + this.selectedBankInterest / 12) ** this.selectedBankMonth) /
        ((1 + this.selectedBankInterest / 12) ** this.selectedBankMonth - 1);
      this.calculationDone = true;
      this.saveLastCalculations();
    },
    saveLastCalculations() {
      this.lastCalcBankName = this.currentBank.name;
      this.lastCalcLoan = this.initialLoan;
      this.lastCalcDownPayment = this.downPayment;
      this.lastCalcMonthlyPayment = Math.round(this.monthlyPayment * 100) / 100;
    },
    checkInitialLoan() {
      this.calculateMinDownPayment();
      this.initialLoan < 0 || this.initialLoan > this.selectedBankMaxLoan
        ? (this.initialLoanError = true)
        : (this.initialLoanError = false);
      this.handleDisabled();
    },
    checkDownPayment() {
      this.calculateMinDownPayment();
      this.downPayment < 0 ||
      this.downPayment < this.selectedBankDownPayment ||
      this.downPayment > this.initialLoan
        ? (this.downPaymentError = true)
        : (this.downPaymentError = false);
      this.handleDisabled();
    },
    handleDisabled() {
      this.initialLoanError ||
      this.downPaymentError ||
      !this.initialLoan ||
      !this.downPayment
        ? (this.isSubmitDisabled = true)
        : (this.isSubmitDisabled = false);
    },
  },
  mounted() {
    this.getAllBanks();
  },
  watch: {
    selectedBankId(val) {
      this.getBank(val);
    },
    initialLoan(val) {
      this.initialLoan = this.initialLoan * 1;
      this.checkInitialLoan();
      this.checkDownPayment();
    },
    downPayment(val) {
      this.downPayment = this.downPayment * 1;
      this.checkDownPayment();
      this.checkInitialLoan();
    },
  },
});
