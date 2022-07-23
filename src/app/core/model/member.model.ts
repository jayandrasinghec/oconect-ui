import { FuseUtils } from '@fuse/utils';

export class Member
{
    id: string;
    name: string;
    lastName: string;
    avatar: string;
    chapter: any;    
    email: string;
    status: string;
    isCoordinator:string;

    /**
     * Constructor
     *
     * @param contact
     */
    constructor(contact)
    {
        {
            this.id = contact.id || FuseUtils.generateGUID();
            this.name = contact.name || '';
            this.lastName = contact.lastName || '';
            this.avatar = contact.avatar || 'assets/images/avatars/profile.jpg';            
            this.chapter = contact.chapter || '';
            this.email = contact.email || '';
            this.status = contact.status || '';
            this.isCoordinator = contact.isCoordinator ? 'YES': 'NO';
           
          
        }
    }
}
