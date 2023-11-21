import { getUrl } from "@/utils/RequestUrl";
import request from "@/utils/request";

export async function getDirList(parent: string | null, type: number) {
    return request(getUrl(`/closure/oss/dir/list`), {
        method: 'POST',
        data: {
            parent: (
                parent === 'collectRoot'
                || parent === 'sourceRoot'
                || parent === 'imageRoot'
                || parent === 'modelRoot'
            ) ? null : parent,
            type: type
        }
    });
}

export async function copyFilesToDir(ids: number[], parent: string, type: number) {
    return request(getUrl(`/closure/oss/dir/move`), {
        method: 'POST',
        data: {
            ids: ids,
            parent: (
                parent === 'collectRoot'
                || parent === 'sourceRoot'
                || parent === 'imageRoot'
                || parent === 'modelRoot'
            ) ? null : parent,
            type: type,
            operator: 1
        }
    });
}