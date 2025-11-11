import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { PartModule } from './parts/part.module';
import { RejectionModule } from './rejections/rejection.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI!, {
      connectionFactory: (connection) => {
        connection.on('error', (error) => {
          console.error('MongoDB connection error:', error);
          process.exit(1);
        });
        return connection;
      },
    }),
    DatabaseModule,
    PartModule,
    RejectionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
