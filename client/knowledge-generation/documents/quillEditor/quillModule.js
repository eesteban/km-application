

var pdfGenerator = function (quill, options){
    this.quill = quill;
    this.docId = options.docId;
};

pdfGenerator.prototype.generatePDF = function () {
    var html = this.quill.getHTML();
    var pdf = new jsPDF();
    pdf.fromHTML(html);
    pdf.output('save_', this.docId+'.pdf');
};

Quill.registerModule('pdfGenerator', pdfGenerator);