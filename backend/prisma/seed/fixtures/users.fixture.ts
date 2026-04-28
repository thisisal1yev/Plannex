import { Role } from '../../../generated/prisma/enums';
import { CuratedUserKey, type UserSeed } from '../types';

export const CURATED_USERS: UserSeed[] = [
  {
    key: CuratedUserKey.ADMIN,
    email: 'admin@planner.ai',
    firstName: 'Elon',
    lastName: 'Musk',
    role: Role.ADMIN,
    avatarUrl:
      'https://upload.wikimedia.org/wikipedia/commons/5/5e/Elon_Musk_-_54820081119_%28cropped%29.jpg',
    createdAt: new Date('2025-12-01T09:00:00Z'),
  },
  {
    key: CuratedUserKey.ORGANIZER_1,
    email: 'organizer@planner.ai',
    firstName: 'Sam',
    lastName: 'Altman',
    role: Role.ORGANIZER,
    avatarUrl:
      'https://upload.wikimedia.org/wikipedia/commons/f/f8/Sam_Altman_TechCrunch_SF_2019_Day_2_Oct_3_%28cropped_3%29.jpg',
    createdAt: new Date('2026-01-10T09:00:00Z'),
  },
  {
    key: CuratedUserKey.ORGANIZER_2,
    email: 'organizer2@planner.ai',
    firstName: 'Sundar',
    lastName: 'Pichai',
    role: Role.ORGANIZER,
    avatarUrl:
      'https://upload.wikimedia.org/wikipedia/commons/c/c3/Sundar_Pichai_-_2023_%28cropped%29.jpg',
    createdAt: new Date('2026-01-14T09:00:00Z'),
  },
  {
    key: CuratedUserKey.VENDOR_1,
    email: 'vendor@planner.ai',
    firstName: 'Linus',
    lastName: 'Torvalds',
    role: Role.VENDOR,
    avatarUrl:
      'https://upload.wikimedia.org/wikipedia/commons/e/e8/Lc3_2018_%28263682303%29_%28cropped%29.jpeg',
    createdAt: new Date('2026-01-20T09:00:00Z'),
  },
  {
    key: CuratedUserKey.VENDOR_2,
    email: 'vendor2@planner.ai',
    firstName: 'Tim',
    lastName: 'Cook',
    role: Role.VENDOR,
    avatarUrl:
      'https://upload.wikimedia.org/wikipedia/commons/8/88/Tim_Cook_March_2026_%28cropped%29.jpg',
    createdAt: new Date('2026-02-04T09:00:00Z'),
  },
  {
    key: CuratedUserKey.VOLUNTEER_1,
    email: 'volunteer@planner.ai',
    firstName: 'Jensen',
    lastName: 'Huang',
    role: Role.VOLUNTEER,
    avatarUrl:
      'https://upload.wikimedia.org/wikipedia/commons/e/e6/Jen-Hsun_Huang_2025.jpg',
    createdAt: new Date('2026-02-16T10:00:00Z'),
  },
  {
    key: CuratedUserKey.VOLUNTEER_2,
    email: 'volunteer2@planner.ai',
    firstName: 'Satya',
    lastName: 'Nadella',
    role: Role.VOLUNTEER,
    avatarUrl:
      'https://upload.wikimedia.org/wikipedia/commons/7/78/MS-Exec-Nadella-Satya-2017-08-31-22_%28cropped%29.jpg',
    createdAt: new Date('2026-02-21T10:00:00Z'),
  },
  {
    key: CuratedUserKey.PARTICIPANT_1,
    email: 'participant@planner.ai',
    firstName: 'Mark',
    lastName: 'Zuckerberg',
    role: Role.PARTICIPANT,
    avatarUrl:
      'https://upload.wikimedia.org/wikipedia/commons/2/21/Mark_Zuckerberg_in_September_2025_%28cropped%29.jpg',
    createdAt: new Date('2026-02-24T10:00:00Z'),
  },
  {
    key: CuratedUserKey.PARTICIPANT_2,
    email: 'participant2@planner.ai',
    firstName: 'Jeff',
    lastName: 'Bezos',
    role: Role.PARTICIPANT,
    avatarUrl:
      'https://upload.wikimedia.org/wikipedia/commons/0/03/Jeff_Bezos_visits_LAAFB_SMC_%283908618%29_%28cropped%29.jpeg',
    createdAt: new Date('2026-02-27T10:00:00Z'),
  },
  {
    key: CuratedUserKey.PARTICIPANT_3,
    email: 'participant3@planner.ai',
    firstName: 'Bill',
    lastName: 'Gates',
    role: Role.PARTICIPANT,
    avatarUrl:
      'https://upload.wikimedia.org/wikipedia/commons/8/88/Bill_Gates_at_the_European_Commission_-_2025_-_P067383-987995_%28cropped%29.jpg',
    createdAt: new Date('2026-03-03T10:00:00Z'),
  },
  {
    key: CuratedUserKey.PARTICIPANT_4,
    email: 'participant4@planner.ai',
    firstName: 'Sheryl',
    lastName: 'Sandberg',
    role: Role.PARTICIPANT,
    avatarUrl:
      'https://upload.wikimedia.org/wikipedia/commons/6/61/Sheryl_Sandberg_WEF_2013_%28crop_by_James_Tamim%29.jpg',
    createdAt: new Date('2026-03-06T10:00:00Z'),
  },
  {
    key: CuratedUserKey.PARTICIPANT_5,
    email: 'participant5@planner.ai',
    firstName: 'Reed',
    lastName: 'Hastings',
    role: Role.PARTICIPANT,
    avatarUrl:
      'https://upload.wikimedia.org/wikipedia/commons/b/b0/Re_publica_2015_-_Tag_1_%2817381870955%29_%28cropped%29.jpg',
    createdAt: new Date('2026-03-11T10:00:00Z'),
  },
];
