import dotenv from 'dotenv';

dotenv.config();

class SupabaseStorageClient {
  constructor() {
    this.storageUrl = process.env.SUPABASE_STORAGE_URL;
    this.bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'galerias';
    this.serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  }

  getBaseUrl() {
    if (!this.storageUrl) {
      throw new Error('SUPABASE_STORAGE_URL não está configurado no .env');
    }
    const cleanUrl = this.storageUrl.replace(/\/$/, '');
    return cleanUrl.endsWith('/storage/v1') ? cleanUrl : `${cleanUrl}/storage/v1`;
  }

  async uploadFile({ filename, buffer, mimeType }) {
    const baseUrl = this.getBaseUrl();
    const uploadUrl = `${baseUrl}/object/${this.bucketName}/${filename}`;

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.serviceKey}`,
        'apikey': this.serviceKey,
        'Content-Type': mimeType || 'image/jpeg',
        'x-upsert': 'true' // Sobrescreve se já existir
      },
      body: buffer
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Falha no upload para Supabase Storage (HTTP ${response.status}): ${errorText}`);
    }

    // Retorna a URL pública consumível da imagem
    return `${baseUrl}/object/public/${this.bucketName}/${filename}`;
  }

  async deleteFile(filename) {
    const baseUrl = this.getBaseUrl();
    const deleteUrl = `${baseUrl}/object/${this.bucketName}/${filename}`;

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.serviceKey}`,
        'apikey': this.serviceKey
      }
    });

    if (!response.ok && response.status !== 404) {
      const errorText = await response.text();
      throw new Error(`Falha ao excluir arquivo do Supabase Storage (HTTP ${response.status}): ${errorText}`);
    }
  }
}

export const supabaseStorage = new SupabaseStorageClient();
