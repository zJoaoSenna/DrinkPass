import React from 'react';

const Contact = () => {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-primary/5 to-transparent">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
            Contato
          </h2>
          <p className="text-lg leading-8 text-gray-600 font-medium">
            Entre em contato conosco para mais informações sobre o <span className="text-primary-drink">Drink</span>
            <span className="text-primary-pass">Pass</span>.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm ring-1 ring-gray-200/50 p-8">
          <div className="mx-auto max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Informações de Contato</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-700">Nome:</p>
                <p className="text-gray-600">João Pedro Senna Valle Vieira</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Email:</p>
                <p className="text-gray-600">jpsenna12@gmail.com</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Telefone:</p>
                <p className="text-gray-600">(31) 99175-1905</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Endereço:</p>
                <p className="text-gray-600">Belo Horizonte, MG</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;