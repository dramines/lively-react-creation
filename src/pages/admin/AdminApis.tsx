
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Database, 
  Server, 
  FileText, 
  Users, 
  ShoppingCart, 
  Mail,
  Calendar,
  MessageSquare,
  Eye,
  Package
} from 'lucide-react';

const AdminApis = () => {
  const apiCategories = [
    {
      id: 'stats',
      title: 'Statistics APIs',
      icon: <Database className="h-5 w-5" />,
      apis: [
        {
          name: 'Admin Stats',
          endpoint: 'https://draminesaid.com/lucci/api/get_admin_stats.php',
          method: 'GET',
          description: 'Get comprehensive admin dashboard statistics',
          parameters: 'None',
          response: {
            success: true,
            data: {
              totalProducts: 150,
              lowStockProducts: 12,
              ordersToday: 5,
              ordersTotal: 234,
              pendingOrders: 8,
              revenueToday: 1250.50,
              revenueWeek: 5670.25,
              revenueMonth: 18450.75,
              revenueTotal: 125300.00,
              visitorsToday: 45,
              visitorsTotal: 2340,
              newsletterSubscribers: 156,
              deviceStats: [
                { device_type: 'Desktop', visitors: 120 },
                { device_type: 'Mobile', visitors: 200 },
                { device_type: 'Tablet', visitors: 45 }
              ],
              countryStats: [
                { country: 'Tunisia', visitors: 180 },
                { country: 'France', visitors: 85 }
              ],
              recentOrders: [
                {
                  id_order: 123,
                  numero_commande: 'CMD-2024-001',
                  total_order: 299.99,
                  status_order: 'pending',
                  payment_status: 'paid',
                  customer_name: 'Customer',
                  date_creation_order: '2024-01-15 10:30:00'
                }
              ],
              chartData: [
                {
                  name: 'Jan 2024',
                  orders: 45,
                  revenue: 12500.00,
                  visitors: 234
                }
              ],
              bestSellingProducts: [
                {
                  id_product: 1,
                  nom_product: 'Product Name',
                  total_sold: 25,
                  revenue: 2500.00
                }
              ]
            },
            debug: {
              timestamp: '2024-01-15 10:30:00',
              today: '2024-01-15',
              database_connected: true
            }
          }
        },
        {
          name: 'Dashboard Stats',
          endpoint: 'https://draminesaid.com/lucci/api/get_dashboard_stats.php',
          method: 'GET',
          description: 'Get general dashboard statistics including revenue and visitor analytics',
          parameters: 'None',
          response: {
            success: true,
            data: {
              total_revenue: 125300.50,
              today_revenue: 1250.25,
              total_orders: 234,
              pending_orders: 8,
              total_visitors: 2340,
              today_visitors: 45,
              device_analytics: [
                { device_type: 'Mobile', visitors: 200 },
                { device_type: 'Desktop', visitors: 120 },
                { device_type: 'Tablet', visitors: 45 }
              ],
              visitor_growth: [
                { date: '2024-01-01', visitors: 23 },
                { date: '2024-01-02', visitors: 31 }
              ],
              revenue_growth: [
                { date: '2024-01-01', revenue: 450.50 },
                { date: '2024-01-02', revenue: 678.75 }
              ],
              top_countries: [
                { country: 'Tunisia', visitors: 180 },
                { country: 'France', visitors: 85 }
              ],
              latest_orders: [
                {
                  id_order: 123,
                  numero_commande: 'CMD-2024-001',
                  total_order: 299.99,
                  status_order: 'pending',
                  date_creation_order: '2024-01-15 10:30:00',
                  nom_customer: 'John',
                  prenom_customer: 'Doe'
                }
              ]
            }
          }
        }
      ]
    },
    {
      id: 'customers',
      title: 'Customer APIs',
      icon: <Users className="h-5 w-5" />,
      apis: [
        {
          name: 'All Customers',
          endpoint: 'https://draminesaid.com/lucci/api/get_all_customers.php',
          method: 'GET',
          description: 'Get all customers with their order statistics',
          parameters: 'None',
          response: {
            success: true,
            data: [
              {
                id_customer: 1,
                nom_customer: 'Doe',
                prenom_customer: 'John',
                email_customer: 'john.doe@email.com',
                telephone_customer: '+216 12 345 678',
                adresse_customer: '123 Main Street',
                ville_customer: 'Tunis',
                code_postal_customer: '1000',
                pays_customer: 'Tunisia',
                date_creation_customer: '2024-01-01 12:00:00',
                date_modification_customer: '2024-01-15 14:30:00',
                total_orders: 5,
                total_spent: 1250.75,
                last_order_date: '2024-01-15 10:30:00'
              }
            ],
            total: 156
          }
        }
      ]
    },
    {
      id: 'products',
      title: 'Product APIs',
      icon: <Package className="h-5 w-5" />,
      apis: [
        {
          name: 'All Products',
          endpoint: 'https://draminesaid.com/lucci/api/get_all_products.php',
          method: 'GET',
          description: 'Get all products with pagination and search',
          parameters: 'limit (int), offset (int), search (string)',
          response: {
            success: true,
            data: [
              {
                id_product: 1,
                nom_product: 'Product Name',
                reference_product: 'REF-001',
                description_product: 'Product description',
                price_product: 299.99,
                itemgroup_product: 'costume',
                img_product: 'uploads/product1.jpg',
                img2_product: 'uploads/product1_2.jpg',
                img3_product: 'uploads/product1_3.jpg',
                img4_product: 'uploads/product1_4.jpg',
                s_size: 5,
                m_size: 10,
                l_size: 8,
                xl_size: 3,
                xxl_size: 2,
                qnty_product: 28,
                createdate_product: '2024-01-01 12:00:00',
                status_product: 'active'
              }
            ],
            total: 150,
            limit: 20,
            offset: 0
          }
        },
        {
          name: 'Delete Product',
          endpoint: 'https://draminesaid.com/lucci/api/delete_product.php',
          method: 'DELETE',
          description: 'Delete a product and its associated images',
          parameters: 'id (int) - Product ID in URL parameter',
          response: {
            success: true,
            message: 'Product deleted successfully'
          }
        }
      ]
    },
    {
      id: 'orders',
      title: 'Order APIs',
      icon: <ShoppingCart className="h-5 w-5" />,
      apis: [
        {
          name: 'Delete Order',
          endpoint: 'https://draminesaid.com/lucci/api/delete_order.php',
          method: 'POST',
          description: 'Delete an order and all related data (items, tracking, delivery addresses)',
          parameters: '{ "order_id": 123 }',
          response: {
            success: true,
            message: 'Order deleted successfully'
          }
        }
      ]
    },
    {
      id: 'reservations',
      title: 'Reservation APIs',
      icon: <Calendar className="h-5 w-5" />,
      apis: [
        {
          name: 'All Reservations',
          endpoint: 'https://draminesaid.com/lucci/api/get_all_reservations.php',
          method: 'GET',
          description: 'Get all reservations with pagination and status filtering',
          parameters: 'limit (int), offset (int), status (string)',
          response: {
            success: true,
            data: [
              {
                id_reservation: 1,
                nom_client: 'John Doe',
                email_client: 'john.doe@email.com',
                telephone_client: '+216 12 345 678',
                date_reservation: '2024-01-20',
                heure_reservation: '14:30:00',
                message_client: 'Request for custom suit fitting',
                statut_reservation: 'pending',
                notes_reservation: 'Admin notes here',
                date_creation: '2024-01-15 10:30:00'
              }
            ],
            total: 45,
            limit: 20,
            offset: 0
          }
        },
        {
          name: 'Confirm Reservation',
          endpoint: 'https://draminesaid.com/lucci/api/confirmer_reservation.php',
          method: 'PUT',
          description: 'Confirm a reservation by changing its status',
          parameters: 'id (int) - Reservation ID in URL parameter',
          response: {
            success: true,
            message: 'Reservation confirmed successfully',
            data: {
              id_reservation: 1,
              nom_client: 'John Doe',
              email_client: 'john.doe@email.com',
              telephone_client: '+216 12 345 678',
              date_reservation: '2024-01-20',
              heure_reservation: '14:30:00',
              message_client: 'Request for custom suit fitting',
              statut_reservation: 'confirmed',
              notes_reservation: 'Admin notes here',
              date_creation: '2024-01-15 10:30:00',
              date_confirmation: '2024-01-15 11:00:00'
            }
          }
        },
        {
          name: 'Delete Reservation',
          endpoint: 'https://draminesaid.com/lucci/api/delete_reservation.php',
          method: 'DELETE',
          description: 'Delete a reservation',
          parameters: 'id (int) - Reservation ID in URL parameter',
          response: {
            success: true,
            message: 'Reservation deleted successfully',
            deleted_id: 1
          }
        }
      ]
    },
    {
      id: 'newsletter',
      title: 'Newsletter APIs',
      icon: <Mail className="h-5 w-5" />,
      apis: [
        {
          name: 'All Newsletter Subscribers',
          endpoint: 'https://draminesaid.com/lucci/api/get_all_newsletter.php',
          method: 'GET',
          description: 'Get all newsletter subscribers with statistics',
          parameters: 'None',
          response: {
            success: true,
            data: [
              {
                id_subscriber: 1,
                email_subscriber: 'subscriber@email.com',
                nom_subscriber: 'John',
                prenom_subscriber: 'Doe',
                status_subscriber: 'active',
                source_subscriber: 'website',
                date_inscription: '2024-01-15 10:30:00',
                date_unsubscribe: null,
                ip_inscription: '192.168.1.1',
                preferences_subscriber: 'all'
              }
            ],
            stats: {
              total_subscribers: 156,
              active_subscribers: 142,
              unsubscribed_count: 14,
              today_subscribers: 3,
              this_month_subscribers: 28
            },
            total: 156
          }
        },
        {
          name: 'Delete Newsletter Subscriber',
          endpoint: 'https://draminesaid.com/lucci/api/delete_newsletter.php',
          method: 'POST',
          description: 'Delete a newsletter subscriber',
          parameters: '{ "id": 1 }',
          response: {
            success: true,
            message: 'Newsletter subscriber deleted successfully'
          }
        }
      ]
    },
    {
      id: 'messages',
      title: 'Message APIs',
      icon: <MessageSquare className="h-5 w-5" />,
      apis: [
        {
          name: 'All Messages',
          endpoint: 'https://draminesaid.com/lucci/api/get_all_messages.php',
          method: 'GET',
          description: 'Get all contact messages with pagination and filtering',
          parameters: 'page (int), limit (int), search (string), vue_filter (string: all|vue|not_vue)',
          response: {
            success: true,
            data: [
              {
                id_message: 1,
                nom_client: 'John Doe',
                email_client: 'john.doe@email.com',
                telephone_client: '+216 12 345 678',
                message_client: 'Hello, I am interested in your custom suits...',
                vue_par_admin: 0,
                date_vue_admin: null,
                date_creation: '2024-01-15 10:30:00'
              }
            ],
            pagination: {
              current_page: 1,
              total_pages: 5,
              total_records: 89,
              per_page: 50,
              has_next: true,
              has_prev: false
            }
          }
        }
      ]
    }
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-playfair font-bold text-gray-900">
                  Admin APIs Documentation
                </h1>
                <p className="text-gray-600 mt-1">
                  Complete list of all APIs used in the admin section with detailed response formats
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Server className="h-6 w-6 text-gray-600" />
                <Badge variant="secondary">
                  {apiCategories.reduce((total, category) => total + category.apis.length, 0)} APIs
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <Tabs defaultValue="stats" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              {apiCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-2">
                  {category.icon}
                  <span className="hidden sm:inline">{category.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {apiCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-6">
                <div className="grid gap-6">
                  {category.apis.map((api, index) => (
                    <Card key={index} className="border-0 shadow-lg">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="font-playfair text-gray-900 flex items-center space-x-3">
                              <FileText className="h-5 w-5" />
                              <span>{api.name}</span>
                            </CardTitle>
                            <CardDescription className="mt-2">
                              {api.description}
                            </CardDescription>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={api.method === 'GET' ? 'default' : api.method === 'POST' ? 'secondary' : api.method === 'PUT' ? 'outline' : 'destructive'}
                            >
                              {api.method}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Endpoint */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Endpoint:</h4>
                          <code className="bg-gray-100 px-3 py-2 rounded text-sm block break-all">
                            {api.endpoint}
                          </code>
                        </div>

                        {/* Parameters */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Parameters:</h4>
                          <code className="bg-gray-100 px-3 py-2 rounded text-sm block">
                            {api.parameters}
                          </code>
                        </div>

                        {/* Response */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Response Format:</h4>
                          <ScrollArea className="h-96 w-full">
                            <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-x-auto">
                              {JSON.stringify(api.response, null, 2)}
                            </pre>
                          </ScrollArea>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminApis;
