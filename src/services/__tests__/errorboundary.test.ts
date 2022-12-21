import { errorBoundary } from "../errorboundary";
jest.mock('fs')

const MOCK_FILE_INFO = {
    '/path/to/file1.js': 'console.log("file1 contents");',
    '/path/to/file2.txt': 'file2 contents',
  };

describe('ErrorBoundary', () => {

    beforeEach(() => {
        require('fs').__setMockFiles(MOCK_FILE_INFO);
    });

    /** check all core path */
    it('Should return an array of errors', () => {
        const { errors } = errorBoundary('', '', '');
        expect(errors.length).toEqual(6);
    });

    /** file extension branch check */
    it('Should return an error when the csv path is incorrect', () => { 
        const fileExists = (path: string) => { return true;}
        const { errors } = errorBoundary('/path/to/file1.js', 'card', '1.30', fileExists);
        expect(errors.length).toEqual(1);
        expect(errors[0]).toEqual('Please specify a valid path to the CSV file with the correct file extension');
    });

    /** test try catch catch */
    it('Should return an error when failing to sanitize inputs', () => {
        const fileExists = (path: string) => { throw new Error('error thing')}
        const { errors } = errorBoundary('/path/to/file1.csv', 'card', '1.30', fileExists);
        expect(errors.length).toEqual(1);
        expect(errors[0]).toEqual("Input values were invalid, please try again.");        
    })

    it('Should error if the share price is negative', () => {
        const fileExists = (path: string) => { return true;}
        const { errors } = errorBoundary('/path/to/file1.csv', 'card', '-1.30', fileExists);    
        expect(errors.length).toEqual(1);
        expect(errors[0]).toEqual('Please specify a positive share price to generate share orders for');
    });    
});