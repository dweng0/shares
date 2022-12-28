import { MOCK_CARD_PAYMENT_STRING } from "../../__mocks__/test.mocks";
import { getPaymentsFromCSV, exportToCsv } from '../downstream';
import BigNumber from 'bignumber.js';
import { generatePayments } from '../paymentprocessor';
import { generateShareOrders } from '../shares';

describe("Tests for downstream controller", () => {

    it("Should return payments from file", async () => { 
        // setup
        const mockFileReader = jest.fn().mockResolvedValue(MOCK_CARD_PAYMENT_STRING);
        const mockPath = "some/path/to/file.csv";
        const expectedOutput = "[{\"customerId\":123,\"date\":\"2019-01-12\",\"amount\":\"900\",\"transactionDetails\":{\"transactionType\":\"CARD\",\"card\":{\"id\":30,\"status\":\"processed\"}},\"fee\":18},{\"customerId\":123,\"date\":\"2019-02-10\",\"amount\":\"900\",\"transactionDetails\":{\"transactionType\":\"CARD\",\"card\":{\"id\":45,\"status\":\"declined\"}},\"fee\":18},{\"customerId\":456,\"date\":\"2019-01-20\",\"amount\":\"4200\",\"transactionDetails\":{\"transactionType\":\"CARD\",\"card\":{\"id\":10,\"status\":\"processed\"}},\"fee\":84}]"

        // execute
        const payments =  await getPaymentsFromCSV(mockPath, mockFileReader);

        if(payments) {
        // verify
        expect(mockFileReader).toHaveBeenCalledWith(mockPath, 'utf8');
        expect(payments.length).toEqual(3);
        expect(JSON.stringify(payments)).toEqual(expectedOutput);
        } else {
            fail("Payments is undefined");
        }
    })

    it("Should handle file reading rejection", async () => {
        // setup
        const mockFileReader = jest.fn().mockRejectedValue("File is empty");
        const mockPath = "some/path/to/file.csv";

        // execute
        const payments = await getPaymentsFromCSV(mockPath, mockFileReader);

        // verify
        expect(mockFileReader).toHaveBeenCalledWith(mockPath, 'utf8');
        expect(payments).toBeUndefined();
    })

    it("Should write file to disk", async () => {
        // setup
        const mockFileWriter    = jest.fn().mockResolvedValue(null);
        const fileName          = "some/path/to/file";
        const payments          = generatePayments(MOCK_CARD_PAYMENT_STRING);
        const shares            = generateShareOrders(payments, new BigNumber(100));
        const headers           = ['customerId', 'shares'];
        const fileWriterOptions = { encoding: 'utf-8' };
        
        // execute
        await exportToCsv(shares, fileName, headers, mockFileWriter);

        // verify we call the file writer
        expect(mockFileWriter).toHaveBeenCalledWith(`${fileName}.csv`, expect.any(String), fileWriterOptions);
    });

    it("Should resolve to false if shares is empty", async () => {
        // setup
        const mockFileWriter    = jest.fn().mockResolvedValue(null);
        const fileName          = "some/path/to/file";
        const shares            = {};
        const headers           = ['customerId', 'shares'];
        
        // execute
        const result = await exportToCsv(shares, fileName, headers, mockFileWriter);

        // verify we do not call the file writer
        expect(mockFileWriter).not.toHaveBeenCalled();
        expect(result).toEqual(false);
    });

    it("Should catch file writing errors", async () => {
        // setup
        const mockFileWriter    = jest.fn().mockRejectedValueOnce("File is empty");
        const fileName          = "some/path/to/file";
        const payments          = generatePayments(MOCK_CARD_PAYMENT_STRING);
        const shares            = generateShareOrders(payments, new BigNumber(100));
        const headers           = ['customerId', 'shares'];
        
        // execute
        const throwable = async () => exportToCsv(shares, fileName, headers, mockFileWriter);

        await expect(throwable).rejects.toEqual("File is empty");
    });

    it("Should use the default file writer if no DI one is provided", async () => {
        
        // setup
        const fileName          = `${__dirname}/__output__/jest_test_output`;
        const payments          = generatePayments(MOCK_CARD_PAYMENT_STRING);
        const shares            = generateShareOrders(payments, new BigNumber(100));
        const headers           = ['customerId', 'shares'];
        
        // execute
        const result = await exportToCsv(shares, fileName, headers);

        // verify we call the file writer
        expect(result).toEqual(true);
    });

    it("Should use the default file reader if no DI one is provided", async () => {
        
        // setup
        const fileName          = `${__dirname}/__input__/jest_test_input.csv`;        
        // execute
        const results = await getPaymentsFromCSV(fileName);

        // verify we call the file writer
        expect(results).toBeDefined();
        if(results) {
            expect(results.length).toEqual(3);
            expect(results[0].customerId).toEqual(123);
        }
    });

    it("Should use default headers if none are provided", async () => {
        // setup
        const mockFileWriter    = jest.fn().mockResolvedValue(null);
        const fileName          = "some/path/to/file";
        const payments          = generatePayments(MOCK_CARD_PAYMENT_STRING);
        const shares            = generateShareOrders(payments, new BigNumber(100));
        const expectedOutput    = "customer_id,shares\n123,18\n456,42";
        const fileWriterOptions = { encoding: 'utf-8' };
        // execute
        await exportToCsv(shares, fileName, undefined, mockFileWriter);

        // verify we call the file writer
        expect(mockFileWriter).toHaveBeenCalledWith(`${fileName}.csv`, expectedOutput, fileWriterOptions);
    });        
});