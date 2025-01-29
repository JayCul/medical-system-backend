import { Injectable, OnModuleInit } from '@nestjs/common';
import mongoose, { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class AppService implements OnModuleInit {
  // URL = "mongodb+srv://jaystechub:dTOO010IqJgFU4sZx@jayscluster.usleh.mongodb.net/?retryWrites=true&w=majority&appName=JaysCluster"
  
  // clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
  constructor(@InjectConnection() private readonly connection: Connection) {
    // async function run() {
    //   try {
    //     // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    //     await mongoose.connect(this.URL, this.clientOptions);
    //     await mongoose.connection.db.admin().command({ ping: 1 });
    //     console.log("Pinged your deployment. You successfully connected to MongoDB!");
    //   } finally {
    //     // Ensures that the client will close when you finish/error
    //     await mongoose.disconnect();
    //   }
    // }
    
    // run().catch(console.dir); 
  }

  onModuleInit() {
    this.connection.on('connected', () => {
      console.log('MongoDB connection established successfully');
    });

    this.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
  }
}
