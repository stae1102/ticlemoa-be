import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ArticleTag } from './articleTag.entity';
import { Common } from './common.entity';
import { User } from './user.entity';

@Entity()
export class Article extends Common {
  @Column()
  link: string;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  content?: string;

  @Column({ default: 0 })
  viewCount: number;

  @Column()
  isPublic: boolean;

  @ManyToOne(() => User, (user) => user.articles)
  @JoinColumn()
  user: User;

  @Column()
  userId: number;

  @OneToMany(() => ArticleTag, (articleTag) => articleTag.article)
  articleTags: ArticleTag[];
}
