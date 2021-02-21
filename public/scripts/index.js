var app = new Vue({
  el: '#app',
  data() {
    return {
      banks: {},
      api: '/api/v1/banks',
      bankName: '',
      bankNameError: false,
      bankInterest: null,
      bankInterestError: false,
      bankMaxLoan: null,
      bankMaxLoanError: false,
      bankMinPayment: null,
      bankMinPaymentError: false,
      bankLoanTerm: null,
      bankLoanTermError: false,
      editMode: false,
      editedBankId: '',
      currentBank: {},
      isSubmitDisabled: true,
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
          this.setEditFields();
        })
        .catch((err) => {
          console.log('ERROR:', err.toString());
        });
    },
    deleteBank(id) {
      if (this.editMode) this.exitEditMode();
      fetch(`${this.api}/${id}`, {
        method: 'DELETE',
      })
        .then((data) => {
          this.getAllBanks();
        })
        .catch((err) => {
          console.log('ERROR:', err.toString());
        });
    },
    addBank() {
      const newBank = {
        name: this.bankName.toLowerCase(),
        interest: this.bankInterest,
        maxLoan: this.bankMaxLoan,
        minDownPayment: this.bankMinPayment,
        term: this.bankLoanTerm,
      };
      fetch(this.api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBank),
      })
        .then((data) => {
          this.getAllBanks();
          this.clearFields();
        })
        .catch((err) => {
          console.log('ERROR:', err.toString());
        });
    },
    updateBank() {
      this.editMode = false;
      const updatedBank = {
        name: this.bankName.toLowerCase(),
        interest: this.bankInterest,
        maxLoan: this.bankMaxLoan,
        minDownPayment: this.bankMinPayment,
        term: this.bankLoanTerm,
      };
      fetch(`${this.api}/${this.editedBankId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBank),
      })
        .then((data) => {
          this.getAllBanks();
          this.clearFields();
        })
        .catch((err) => {
          console.log('ERROR:', err.toString());
        });
    },
    checkBankName() {
      let currentNames = [];
      this.banks.forEach((el) => {
        currentNames.push(el.name);
      });
      if (this.editMode) {
        const index = currentNames.indexOf(this.currentBank.name);
        if (index > -1) {
          currentNames.splice(index, 1);
        }
      }
      currentNames.includes(this.bankName)
        ? (this.bankNameError = true)
        : (this.bankNameError = false);
    },
    checkBankInterest() {
      this.bankInterest < 0 || this.bankInterest > 100
        ? (this.bankInterestError = true)
        : (this.bankInterestError = false);
    },
    checkBankMaxLoan() {
      this.bankMaxLoan < 0
        ? (this.bankMaxLoanError = true)
        : (this.bankMaxLoanError = false);
    },
    checkBankMinPayment() {
      this.bankMinPayment < 0 || this.bankMinPayment > 100
        ? (this.bankMinPaymentError = true)
        : (this.bankMinPaymentError = false);
    },
    checkBankLoanTerm() {
      this.bankLoanTerm < 0 || this.bankLoanTerm > 240
        ? (this.bankLoanTermError = true)
        : (this.bankLoanTermError = false);
    },
    startEditMode(id) {
      this.editMode = true;
      this.editedBankId = id;
      this.getBank(id);
    },
    exitEditMode() {
      this.editMode = false;
      this.clearFields();
    },
    setEditFields() {
      this.bankName = this.currentBank.name;
      this.bankInterest = this.currentBank.interest;
      this.bankMaxLoan = this.currentBank.maxLoan;
      this.bankMinPayment = this.currentBank.minDownPayment;
      this.bankLoanTerm = this.currentBank.term;
    },
    clearFields() {
      this.bankName = '';
      this.bankInterest = null;
      this.bankMaxLoan = null;
      this.bankMinPayment = null;
      this.bankLoanTerm = null;
    },
    handleDisabled() {
      this.bankNameError ||
      this.bankInterestError ||
      this.bankMaxLoanError ||
      this.bankMinPaymentError ||
      this.bankLoanTermError ||
      !this.bankName ||
      !this.bankInterest ||
      !this.bankMaxLoan ||
      !this.bankMinPayment ||
      !this.bankLoanTerm
        ? (this.isSubmitDisabled = true)
        : (this.isSubmitDisabled = false);
    },
  },
  mounted() {
    this.getAllBanks();
  },
  watch: {
    bankName(val) {
      this.checkBankName();
      this.handleDisabled();
    },
    bankInterest(val) {
      this.checkBankInterest();
      this.handleDisabled();
    },
    bankMaxLoan(val) {
      this.checkBankMaxLoan();
      this.handleDisabled();
    },
    bankMinPayment(val) {
      this.checkBankMinPayment();
      this.handleDisabled();
    },
    bankLoanTerm(val) {
      this.bankLoanTerm = Math.floor(this.bankLoanTerm);
      this.checkBankLoanTerm();
      this.handleDisabled();
    },
  },
});
