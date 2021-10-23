const methods = ['post', 'patch', 'put', 'delete'];

type TRoute = string

type TCrudOpt = 'post' | 'patch' | 'put' | 'delete'
type roomRole = string // room based on role

export interface JsonBody {
    httpReferer: string,
    entity: string,
    roles: roomRole[],
    data: Record<string, any>[],
    method: TCrudOpt,
}

export interface IReceivedData {
    payload: {
        roles: roomRole[]
        own: string
    }
}

const jsonBody = {
    "method": methods[methodsIndex],
    "httpReferer": 'here.com',
    "entity": entity,
    "roles": roles,
    "data": data,
};
