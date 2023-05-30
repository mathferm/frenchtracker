import { DataSource } from 'typeorm'
import configuration from '../../configuration.js'
import GuildOptions from './GuildOptions.js'
import Scammer from './Scammer.js'

export const DATA_SOURCE = new DataSource({
  ...configuration.database,
  entities: [GuildOptions, Scammer],
  synchronize: process.env.NODE_ENV === 'development',
})