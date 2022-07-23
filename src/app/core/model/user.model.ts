import { FuseUtils } from '@fuse/utils';

export class User
{
    id: string;
    username: string;    
    avatar: string;     
    email: string;
    mobile: string;  
    active:boolean;
    isCoordinator:string;
    chapter:string;
    /**
     * Constructor
     *
     * @param contact
     */
    constructor(contact)
    {
        {
            this.id = contact._id || FuseUtils.generateGUID();
            this.username = contact.username || '';          
            this.avatar = contact.avatar || 'assets/images/avatars/profile.jpg';            
            this.email = contact.email || '';
            this.mobile = contact.mobile || '';  
            this.active =  contact.active || false; 
            this.chapter = contact.members ? contact.members[0].chapter.name : '';
            this.isCoordinator = contact.members ? (contact.members[0].isCoordinator ? 'YES': 'NO') : '';        
        }
    }
}
