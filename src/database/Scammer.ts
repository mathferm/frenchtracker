import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn } from 'typeorm'
import { DATA_SOURCE } from './index.js'
import configuration from '../../configuration.js'

@Entity()
export default class Scammer {
  @PrimaryColumn({type: 'uuid'})
  uuid!: string

  @Column({length: 16})
  initialName!: string

  @Column({type: 'varchar', unique: true})
  discordId!: string

  @Column({type: 'varchar'})
  adderDiscordId!: string

  @CreateDateColumn({type: 'datetime'})
  addedAt!: Date

  @Column({type: 'text', default: configuration.messages.default.reason})
  addReason!: string

  @DeleteDateColumn({type: 'datetime', nullable: true, default: null})
  removedAt?: Date

  @Column({type: 'text', nullable: true, default: configuration.messages.default.reason})
  removeReason?: string

  @Column({type: 'text', nullable: true, default: configuration.messages.default.proof})
  proof?: string
}

export function getRepository() {
  return DATA_SOURCE.getRepository(Scammer)
}

export async function getScammer(identifier: string, withDeleted = false) {
  const query = getRepository()
    .createQueryBuilder('scammer')
    .select()
    .where('scammer.discordId = (:identifier)', {identifier})
    .orWhere('scammer.uuid = (:identifier)', {identifier})
    .orWhere('LOWER(scammer.initialName) = LOWER((:identifier))', {identifier})

  return (withDeleted ? query.withDeleted() : query).getOne()
}

export async function addScammer(uuid: string, initialName: string, discordId: string, reporterDiscordId: string, addReason?: string, proof?: string) {
  const repository = getRepository()
  if (discordId==undefined){
    discordId="unknown"
  }
  if (uuid==undefined){
    uuid="unknown"
  }
  if (initialName==undefined){
    initialName="unknown"
  }
  return await repository.save(repository.create({
    uuid,
    initialName,
    discordId,
    adderDiscordId: reporterDiscordId,
    addReason,
    proof,
  }))
}

export async function updateScammer(uuid: string, addReason?: string, removeReason?: string, proof?: string) {
  return getRepository().update({uuid}, {addReason, proof, removeReason})
}

export async function removeScammer(uuid: string, removeReason?: string) {
  return getRepository().update({uuid}, {removedAt: new Date(), removeReason})
}

export async function forceRemoveScammer(uuid: string) {
  return getRepository().delete({uuid})
}

export async function scammerrembourse(identifier: string) {
  const scammer = await getScammer(identifier);
  if (scammer) {
    let nouvelleaddreason = scammer.addReason;
    const rembourseSuffix = " (Remboursé)";

    if (nouvelleaddreason.includes(rembourseSuffix)) {
      nouvelleaddreason = nouvelleaddreason.replace(rembourseSuffix, "");
    } else {
      nouvelleaddreason.replace(rembourseSuffix,"");
    }

    await updateScammer(scammer.uuid, nouvelleaddreason);
  }
}
