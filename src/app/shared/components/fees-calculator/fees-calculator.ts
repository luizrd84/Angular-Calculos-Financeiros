import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageModal } from '../message-modal/message-modal';

type parcela = {
  numero: number;
  valor: string;
  vencimento: string;
};

@Component({
  selector: 'app-fees-calculator',
  imports: [FormsModule, CommonModule, MessageModal ],
  templateUrl: './fees-calculator.html',
  styleUrl: './fees-calculator.css',
})
export class FeesCalculator {

  tipoPessoa:string = "pf"; 
  valorLiquido:number = 0.00;
  valorLiquidoFormatado: string = ""; 
  taxaJuros:number = 0.00;
  taxaJurosFormatada:string = "";
  tacPercentual:number = 0.00;
  tacPercentualFormatado:string = "";
  tacMax:number = 500000;
  tacMaxFormatada:string = "R$ 5.000,00";
  iofFixoPF:number = 0.38;
  iofFixoPJ:number = 0.95;
  iofFixoFormatado:string = "0,38";
  iofVariavelPF:number = 0.0082;
  iofVariavelPJ:number = 0.0082;
  iofVariavelFormatado:string = "0,0082";
  quantidadeParcelas:number = 0;
  planoPagamento:string= "price";

  carencia:number = 0;

  mostrarIofFixo = false;
  mostrarIofVariavel = false;

  //Variáveis calculadas 
  resumoValorTotalFinanciado: number = 0;
  resumoValorTarifa: number = 0;
  resumoValorIof:number = 0;
  resumoData:string = "";

  //Simulação
  simulacao: parcela[] = [];
  exibirSimulacao:boolean = false;

   //Exemplo de utilização de Modal - simples
  showModal = false;
  openModal() {
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
  }

  calcularValorFinanciado() {
    
    //Calculando o percentual de IOF a ser financiado
    let iof;
    if(this.quantidadeParcelas * 30 > 365 ) {
      iof = this.converterIOFParaNumero(this.iofFixoFormatado)/100 + (this.converterIOFParaNumero(this.iofVariavelFormatado)/100) * 365;
    } else {
      iof = this.converterIOFParaNumero(this.iofFixoFormatado)/100 + (this.converterIOFParaNumero(this.iofVariavelFormatado)/100) * this.quantidadeParcelas * 30;
    }
     
    console.log("IOF = " + iof);

    let taxasFinanciadas = this.tacPercentual/100 + iof;
  
    let valorTotalFinanciado = ((this.valorLiquido/100) / (1 - taxasFinanciadas));

    //Verificando se passa do valor da TAC máxima
    if((valorTotalFinanciado) * (this.tacPercentual/100) > (this.tacMax/100)) {                  
      valorTotalFinanciado = (((this.valorLiquido/100) + (this.tacMax/100)) / (1 - iof));      
      this.resumoValorTarifa = this.tacMax/100;
    } else {
      this.resumoValorTarifa = (valorTotalFinanciado) * (this.tacPercentual/100);
    }

    this.resumoValorIof = valorTotalFinanciado * iof;
    this.resumoValorTotalFinanciado = valorTotalFinanciado;
    this.resumoData = new Date().toLocaleDateString('pt-BR');
        
    return valorTotalFinanciado;

  }

  calculoParcelaPrice():number {  
    let parcela = this.calcularValorFinanciado() * ((this.taxaJuros/100) / (
      1 - (1+this.taxaJuros/100)**-this.quantidadeParcelas  
    ))
    // console.log(parcela);
    return parcela;
  }

  calculoParcelasSAC():number[] {    
    let saldoDevedor = this.calcularValorFinanciado();
    const amortizacao = saldoDevedor / this.quantidadeParcelas;
    const parcelas: number[] = [];

    console.log("amortizacao = " + amortizacao);

    for (let i = 1; i <= this.quantidadeParcelas; i++) {
      parcelas.push( Number((amortizacao + saldoDevedor*(this.taxaJuros/100)).toFixed(2)));
      saldoDevedor -= amortizacao;
    }    
    
    return parcelas;
  }

  adicionarMesesAUmaData(date: Date, months:number): Date {
    const originalDay = date.getDate();
    const year = date.getFullYear();
    const month = date.getMonth();

    const targetMonth = month + months;

    // Último dia do próximo mês
    const lastDayNextMonth = new Date(year, targetMonth + 1, 0).getDate();

    if (originalDay > lastDayNextMonth) {
      // Vai para o dia 1 do mês seguinte ao próximo mês
      return new Date(year, targetMonth + 1, 1);
    }

    return new Date(year, targetMonth, originalDay);
  }

  converterIOFParaString(valor: number): string {
    return valor.toString().replace('.', ',');    
  }

  converterIOFParaNumero(valor: string): number {
    return Number(
      valor
        .replace(',', '.')    // troca vírgula por ponto
    );
  }
  
  ngOnInit() {   
    this.iofFixoFormatado = this.converterIOFParaString(this.iofFixoPF);
    this.iofVariavelFormatado = this.converterIOFParaString(this.iofVariavelPF);
  }

  alterarTipoPessoa(tipo: string) {
    this.tipoPessoa = tipo;

    if (tipo === 'pf') {
      this.iofFixoFormatado = this.converterIOFParaString(this.iofFixoPF);
      this.iofVariavelFormatado = this.converterIOFParaString(this.iofVariavelPF);      
    } else {
      this.iofFixoFormatado = this.converterIOFParaString(this.iofFixoPJ);
      this.iofVariavelFormatado = this.converterIOFParaString(this.iofVariavelPJ);      
    }

    console.log('Alterou para:', tipo);
  }
  
  toggleInput(id:string) {
    const input = document.getElementById(id);
    input!.classList.toggle("show-input");
  }

  formatarValorContrato(event: string) {
    // Remove tudo que não é número
    const apenasNumeros = event.replace(/\D/g, '');
    
    if (!apenasNumeros) {
      this.valorLiquido = 0;
      this.valorLiquidoFormatado = '';
      return;
    }

    // Valor em centavos
    this.valorLiquido = parseInt(apenasNumeros, 10);

    // Formata para R$ dividindo por 100
    this.valorLiquidoFormatado = new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL', 
      minimumFractionDigits: 2 
    }).format(this.valorLiquido / 100);
  }

  formatarValorTarifa(event: string) {
    // Remove tudo que não é número
    const apenasNumeros = event.replace(/\D/g, '');
    
    if (!apenasNumeros) {
      this.tacMax = 0;
      this.tacMaxFormatada = '';
      return;
    }

    // Valor em centavos
    this.tacMax = parseInt(apenasNumeros, 10);

    // Formata para R$ dividindo por 100
    this.tacMaxFormatada = new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL', 
      minimumFractionDigits: 2 
    }).format(this.tacMax / 100);
  }
 

  formatarTaxaJuros(event: string) {
    // remove tudo que não seja número
    const apenasNumeros = event.replace(/\D/g, '');
    
    if (!apenasNumeros) {
      this.taxaJuros = 0;
      this.taxaJurosFormatada = '';
      return;
    }

    // transformando em número com 2 casas - Ex: 3 → 0,03 ; 33 → 0,33 ; 333 → 3,33
    this.taxaJuros = parseInt(apenasNumeros, 10) / 100;

    // Formata com 2 casas decimais e vírgula
    this.taxaJurosFormatada = this.taxaJuros.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  }

  formatarPercentualTac(event: string) {
    // remove tudo que não seja número
    const apenasNumeros = event.replace(/\D/g, '');
    
    if (!apenasNumeros) {
      this.tacPercentual = 0;
      this.tacPercentualFormatado = '';
      return;
    }

    // transformando em número com 2 casas- Ex: 3 → 0,03 ; 33 → 0,33 ; 333 → 3,33
    this.tacPercentual = parseInt(apenasNumeros, 10) / 100;

    // Formata com 2 casas decimais e vírgula
    this.tacPercentualFormatado = this.tacPercentual.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  }

  formatarIOFFixo(event: string) {
    // remove tudo que não seja número
    const apenasNumeros = event.replace(/\D/g, '');
    
    if (!apenasNumeros) {
      this.iofFixoPF = 0;
      this.iofFixoFormatado = '';
      return;
    }

    // transformando em número com 2 casas - Ex: 3 → 0,03 ; 33 → 0,33 ; 333 → 3,33
    this.iofFixoPF = parseInt(apenasNumeros, 10) / 100;

    // Formata com 2 casas decimais e vírgula
    this.iofFixoFormatado = this.iofFixoPF.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  }

  formatarIOFVariavel(event: string) {
    // remove tudo que não seja número
    const apenasNumeros = event.replace(/\D/g, '');
    
    if (!apenasNumeros) {
      this.iofVariavelPF = 0;
      this.iofVariavelFormatado = '';
      return;
    }

    // transformando em número com 2 casas- Ex: 3 → 0,03 ; 33 → 0,33 ; 333 → 3,33
    this.iofVariavelPF = parseInt(apenasNumeros, 10) / 100;

    // Formata com 2 casas decimais e vírgula
    this.iofVariavelFormatado = this.iofVariavelPF.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  }

  apenasNumeros(event: KeyboardEvent) {
    const char = event.key;
    // permite: números, backspace, delete, tab, setas
    if (!/[0-9]/.test(char) &&
        char !== 'Backspace' &&
        char !== 'Delete' &&
        char !== 'ArrowLeft' &&
        char !== 'ArrowRight' &&
        char !== 'Tab') {
      event.preventDefault();
    }
  }


  verificarPreenchimentoCampos():boolean {
    if(this.valorLiquidoFormatado!=="" && this.taxaJurosFormatada!=="" && this.tacMaxFormatada!=="" &&
        this.tacPercentualFormatado!=="" && this.quantidadeParcelas>0
    ) {
      return true;
    }
    return false;
  }

  preencherParcelas() {
    //PLANO DE PAGAMENTO PRICE
    if(this.planoPagamento === "price") {      
      const parcelaPrice = this.calculoParcelaPrice();

      const data = new Date();
      this.simulacao = [];
      for (let i = 1; i <= this.quantidadeParcelas; i++) {
        const novaParcela: parcela = {
          numero: i,
          valor: new Intl.NumberFormat('pt-BR', { 
            style: 'currency', 
            currency: 'BRL', 
            minimumFractionDigits: 2 
            }).format(parcelaPrice),
          vencimento: (this.adicionarMesesAUmaData(data, i).toLocaleDateString('pt-BR'))
        }
        this.simulacao.push(novaParcela);        
      }  
      //PLANO DE PAGAMENTO SAC
    } else if (this.planoPagamento === "sac") {

      const parcelasSac: number[] = this.calculoParcelasSAC();
      this.simulacao = [];
      const data = new Date();
      for (let i = 0; i < this.quantidadeParcelas; i++) {
        const novaParcela: parcela = {
          numero: i+1,
          valor: new Intl.NumberFormat('pt-BR', { 
            style: 'currency', 
            currency: 'BRL', 
            minimumFractionDigits: 2 
            }).format(parcelasSac[i]),
          vencimento: (this.adicionarMesesAUmaData(data, i).toLocaleDateString('pt-BR'))
        }
        this.simulacao.push(novaParcela);
      }
    }
  }

  simular() {

    console.log("plano = " + this.planoPagamento);
    if (this.verificarPreenchimentoCampos()) {
      this.preencherParcelas();    
      this.exibirSimulacao = true;  
    }
    else{
      this.openModal();     
      this.exibirSimulacao = false;
    }        
  }  
}



