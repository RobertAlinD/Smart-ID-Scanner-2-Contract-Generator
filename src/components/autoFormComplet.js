import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { FormLabel, Input, Button, VStack, Textarea } from '@chakra-ui/react';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

const AutoFormComplet = ({ initialData }) => {
  const [contract, setContract] = useState('');
  const [contractText, setContractText] = useState('');

  const generateContract = (values) => {
    const contractTemplateText = `
    Contract de Vânzare-Cumpărare Auto

    Subsemnatul ${values.nume} ${values.prenume}, având CNP ${values.cnp}, cu seria ${values.seria} și numărul ${values.nr}, cetățenie ${values.cetatenie}, născut în ${values.locNastere}, domiciliat în ${values.adresa}, denumit în continuare „Vânzător”,

    am convenit la următoarele:

    Obiectul contractului este autovehiculul cu Numarul de inmatriculare XXXXX, seria VIN XXXXX, aflat în proprietatea Vânzătorului.

    ...

    Data încheierii contractului: ${new Date().toLocaleDateString('ro-RO')}.
    `;

    const contractTemplateDocx = [
        new Paragraph({
            children: [new TextRun("Contract de Vânzare-Cumpărare Auto")],
            alignment: "center",
            spacing: { after: 200 },
            style: {
                font: { size: 80 },
                bold: true
            }
        }),
        new Paragraph({
            children: [
                new TextRun(`Subsemnatul ${values.nume} ${values.prenume}, având CNP ${values.cnp},`),
                new TextRun(` cetățenie ${values.cetatenie}, născut în ${values.locNastere},`),
                new TextRun(` domiciliat în ${values.adresa}, denumit în continuare „Vânzător”,`),
            ],
            spacing: { before: 200, after: 200 },
            style: {
                font: { size: 24 }
            }
        }),
        new Paragraph({
            children: [
                new TextRun("am convenit la următoarele:"),
            ],
            spacing: { before: 200, after: 200 },
            style: {
                font: { size: 24 }
            }
        }),
        new Paragraph({
            children: [
                new TextRun(`Obiectul contractului este autovehiculul cu seria ${values.seria} și numărul ${values.nr}, aflat în proprietatea Vânzătorului.`),
            ],
            spacing: { after: 200 },
            style: {
                font: { size: 24 }
            }
        }),
        new Paragraph({
            text: "...",
            spacing: { before: 200, after: 200 },
            style: {
                font: { size: 24 }
            }
        }),
        new Paragraph({
            children: [
                new TextRun(`Data încheierii contractului: ${new Date().toLocaleDateString('ro-RO')}.`),
            ],
            spacing: { before: 200, after: 200 },
            style: {
                font: { size: 24 }
            }
        }),
    ];

    setContract(contractTemplateDocx);
    setContractText(contractTemplateText.trim());
  };

  const downloadDocxFile = () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: contract,
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, 'contract.docx');
    });
  };

  return (
    <Formik
      initialValues={initialData}
      enableReinitialize
      onSubmit={generateContract}
    >
      {() => (
        <Form className="form-container">
          <VStack spacing={4} align="flex-start">
            <FormLabel htmlFor="seria">Seria:</FormLabel>
            <Field id="seria" name="seria" as={Input} className="form-field" />
            <FormLabel htmlFor="nr">Nr:</FormLabel>
            <Field id="nr" name="nr" as={Input} className="form-field" />
            <FormLabel htmlFor="nume">Nume:</FormLabel>
            <Field id="nume" name="nume" as={Input} className="form-field" />
            <FormLabel htmlFor="prenume">Prenume:</FormLabel>
            <Field id="prenume" name="prenume" as={Input} className="form-field" />
            <FormLabel htmlFor="cnp">CNP:</FormLabel>
            <Field id="cnp" name="cnp" as={Input} className="form-field" />
            <FormLabel htmlFor="cetatenie">Cetățenie:</FormLabel>
            <Field id="cetatenie" name="cetatenie" as={Input} className="form-field" />
            <FormLabel htmlFor="locNastere">Loc Naștere:</FormLabel>
            <Field id="locNastere" name="locNastere" as={Input} className="form-field" />
            <FormLabel htmlFor="adresa">Adresă de resedintă:</FormLabel>
            <Field id="adresa" name="adresa" as={Input} className="form-field" />
            
            <Button type="submit" colorScheme="green" className="submit-button">
              Make a Contract .. ✍
            </Button>
            <Button onClick={downloadDocxFile} colorScheme="blue" className="download-button" mt={4}>
              Download Contract DOCX 📄
            </Button>
          </VStack>

          {contractText && (
            <VStack spacing={4} align="flex-start" mt={4} id="contract-generated">
              <FormLabel>Contract Generat:</FormLabel>
              <Textarea
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
                height="500px"
              />
            </VStack>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default AutoFormComplet;
