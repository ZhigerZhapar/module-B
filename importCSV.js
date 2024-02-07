
import fs from 'fs';
import csv from 'csv-parser';

export const importDataFromCSV = (csvFilePath) => {
    return new Promise((resolve, reject) => {
        try {
            console.log('CSV file path:', csvFilePath);
            const data = [];

            fs.createReadStream(csvFilePath)
                .pipe(csv())
                .on('data', (row) => {
                    data.push(row);
                })
                .on('end', () => {
                    console.log('CSV data imported:', data);
                    resolve(data);
                });
        } catch (error) {
            reject(error);
        }
    });
};